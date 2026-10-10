"""Local UI checks with an isolated SQLite counter; never calls the production API."""
import argparse
import os
from pathlib import Path
import re
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

root = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(root))
from server.counters import CounterStore, make_handler

parser = argparse.ArgumentParser()
parser.add_argument("--port", type=int, default=8780)
args = parser.parse_args()
os.chdir(root)
csp = re.search(r'Content-Security-Policy "([^"]+)"', (root / "deploy/nginx.conf").read_text()).group(1)
store = CounterStore(root / ".test-output/dev-counters.sqlite3", 326)
CounterHandler = make_handler(store, {"http://127.0.0.1:" + str(args.port), "http://localhost:" + str(args.port)})

class Handler(CounterHandler, SimpleHTTPRequestHandler):
    extensions_map = {**SimpleHTTPRequestHandler.extensions_map, ".mjs": "application/javascript", ".wasm": "application/wasm"}

    def do_GET(self):
        if self.path == "/sw.js":
            # Development changes should not be masked by the production shell cache.
            payload = b"self.addEventListener('install', e => self.skipWaiting()); self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));"
            self.send_response(200)
            self.send_header("Content-Type", "application/javascript")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers(); self.wfile.write(payload)
        elif self.path.startswith("/api/") or self.path == "/health":
            CounterHandler.do_GET(self)
        else:
            SimpleHTTPRequestHandler.do_GET(self)

    def end_headers(self):
        self.send_header("Content-Security-Policy", csp)
        self.send_header("Cache-Control", "no-cache")
        self.send_header("X-Content-Type-Options", "nosniff")
        super().end_headers()

print("Stampfel preview: http://127.0.0.1:" + str(args.port), flush=True)
ThreadingHTTPServer(("127.0.0.1", args.port), Handler).serve_forever()
