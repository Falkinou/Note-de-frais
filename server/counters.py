"""Anonymous, durable Stampfel counters. No receipts or account information are uploaded."""
import hashlib
import json
import os
import re
import sqlite3
import threading
import urllib.request
from contextlib import contextmanager
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

VERSION = "1.8.0"
DEVICE = re.compile(r"^[a-f0-9]{64}$")
EVENT = re.compile(r"^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$")
MAX_COUNT = 100_000_000


def valid_count(value):
    return type(value) is int and 0 <= value <= MAX_COUNT


class CounterStore:
    def __init__(self, path, legacy_count=0):
        if not valid_count(legacy_count):
            raise ValueError("Invalid legacy count")
        self.path = str(path)
        Path(path).parent.mkdir(parents=True, exist_ok=True)
        with self.connection() as db:
            db.execute("PRAGMA journal_mode=WAL")
            db.executescript("""
                CREATE TABLE IF NOT EXISTS metadata (key TEXT PRIMARY KEY, value INTEGER NOT NULL);
                CREATE TABLE IF NOT EXISTS devices (
                    id TEXT PRIMARY KEY, legacy_count INTEGER NOT NULL CHECK(legacy_count >= 0)
                );
                CREATE TABLE IF NOT EXISTS events (
                    device_id TEXT NOT NULL REFERENCES devices(id), id TEXT NOT NULL,
                    PRIMARY KEY (device_id, id)
                );
            """)
            # Seeding never resets a live database, including after a rollback.
            db.execute("INSERT OR IGNORE INTO metadata VALUES ('legacy_count', ?)", (legacy_count,))

    @contextmanager
    def connection(self):
        db = sqlite3.connect(self.path, timeout=10)
        try:
            db.execute("PRAGMA foreign_keys=ON")
            db.execute("PRAGMA synchronous=FULL")
            with db:
                yield db
        finally:
            db.close()

    @staticmethod
    def community(db):
        return db.execute("SELECT value FROM metadata WHERE key='legacy_count'").fetchone()[0] + db.execute("SELECT COUNT(*) FROM events").fetchone()[0]

    def totals(self):
        with self.connection() as db:
            return {"community": self.community(db)}

    def sync(self, device, legacy_count, events):
        if not isinstance(device, str) or not DEVICE.fullmatch(device):
            raise ValueError("Invalid device")
        if not valid_count(legacy_count):
            raise ValueError("Invalid count")
        if not isinstance(events, list) or len(events) > 100 or any(not isinstance(e, str) or not EVENT.fullmatch(e) for e in events):
            raise ValueError("Invalid events")
        key = hashlib.sha256(device.encode()).hexdigest()
        with self.connection() as db:
            db.execute("BEGIN IMMEDIATE")
            # The old personal count is already part of the old community count.
            # Import it exactly once for this device; never add it to the global total.
            db.execute("INSERT OR IGNORE INTO devices VALUES (?, ?)", (key, legacy_count))
            db.executemany("INSERT OR IGNORE INTO events VALUES (?, ?)", [(key, event) for event in events])
            initial = db.execute("SELECT legacy_count FROM devices WHERE id=?", (key,)).fetchone()[0]
            personal = initial + db.execute("SELECT COUNT(*) FROM events WHERE device_id=?", (key,)).fetchone()[0]
            return {"personal": personal, "community": self.community(db), "accepted": list(dict.fromkeys(events))}

    def observe_legacy(self, count):
        if not valid_count(count):
            raise ValueError("Invalid legacy count")
        with self.connection() as db:
            # Old installed clients may still increment the old worker. Import only
            # that monotonically increasing baseline, never our new VPS increments.
            db.execute("UPDATE metadata SET value=MAX(value, ?) WHERE key='legacy_count'", (count,))

    def backup(self, destination):
        with self.connection() as source, sqlite3.connect(destination) as target:
            source.backup(target)


def make_handler(store, allowed_origins):
    class Handler(BaseHTTPRequestHandler):
        server_version = "Stampfel"

        def log_message(self, format, *args):
            # Do not retain IPs, device tokens or request bodies in access logs.
            pass

        def reply(self, status, payload):
            data = json.dumps(payload, separators=(",", ":")).encode()
            self.send_response(status)
            self.send_header("Content-Type", "application/json; charset=utf-8")
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.send_header("Vary", "Origin")
            origin = self.headers.get("Origin")
            if origin in allowed_origins:
                self.send_header("Access-Control-Allow-Origin", origin)
                self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
                self.send_header("Access-Control-Allow-Headers", "Content-Type, X-Stampfel-Device")
                self.send_header("Access-Control-Max-Age", "3600")
            self.end_headers()
            self.wfile.write(data)

        def origin_allowed(self):
            origin = self.headers.get("Origin")
            return origin is None or origin in allowed_origins

        def do_OPTIONS(self):
            self.reply(200 if self.origin_allowed() else 403, {})

        def do_GET(self):
            if self.path == "/health":
                self.reply(200, {"ok": True, "version": VERSION, **store.totals()})
            elif self.path == "/api/counters":
                self.reply(200, store.totals())
            else:
                self.reply(404, {"error": "Not found"})

        def do_POST(self):
            if self.path != "/api/counters/sync":
                self.reply(404, {"error": "Not found"})
                return
            if not self.origin_allowed():
                self.reply(403, {"error": "Origin not allowed"})
                return
            if self.headers.get("Content-Type", "").split(";")[0] != "application/json":
                self.reply(415, {"error": "JSON required"})
                return
            try:
                length = int(self.headers.get("Content-Length", "0"))
                if not 0 < length <= 8192:
                    self.reply(413, {"error": "Invalid body size"})
                    return
                self.connection.settimeout(10)
                data = json.loads(self.rfile.read(length))
                if not isinstance(data, dict):
                    raise ValueError("Invalid payload")
                result = store.sync(self.headers.get("X-Stampfel-Device", ""), data.get("legacyCount"), data.get("events"))
            except (ValueError, UnicodeError, TimeoutError):
                self.reply(400, {"error": "Invalid request"})
                return
            except sqlite3.Error:
                self.reply(503, {"error": "Counter temporarily unavailable"})
                return
            self.reply(200, result)

    return Handler


def legacy_bridge(store, url, stop):
    """Read-only bridge for installed 1.7 clients; new clients only contact the VPS."""
    while not stop.is_set():
        try:
            request = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "Stampfel/" + VERSION})
            with urllib.request.urlopen(request, timeout=5) as response:
                payload = response.read(4096)
            store.observe_legacy(json.loads(payload)["count"])
        except (OSError, ValueError, KeyError, sqlite3.Error):
            # A worker outage never resets the durable imported baseline.
            pass
        stop.wait(60)


def main():
    store = CounterStore(os.environ.get("COUNTER_DB", "/data/counters.sqlite3"), int(os.environ.get("LEGACY_COUNTER_SEED", "0")))
    origins = set(os.environ.get("ALLOWED_ORIGINS", "https://stampfel.mycloudapi.fr,https://falkinou.github.io").split(","))
    url = os.environ.get("LEGACY_COUNTER_URL", "")
    if url:
        threading.Thread(target=legacy_bridge, args=(store, url, threading.Event()), daemon=True).start()
    address = (os.environ.get("HOST", "0.0.0.0"), int(os.environ.get("PORT", "8090")))
    print("Stampfel counters " + VERSION + " ready", flush=True)
    ThreadingHTTPServer(address, make_handler(store, origins)).serve_forever()


if __name__ == "__main__":
    main()
