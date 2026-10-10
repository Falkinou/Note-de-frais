import concurrent.futures
import json
import tempfile
import threading
import unittest
import urllib.error
import urllib.request
import uuid
from http.server import ThreadingHTTPServer
from pathlib import Path
from server.counters import CounterStore, make_handler


class CounterTests(unittest.TestCase):
    def setUp(self):
        self.directory = tempfile.TemporaryDirectory()
        self.path = Path(self.directory.name) / "counter.sqlite3"
        self.store = CounterStore(self.path, 326)
        self.device = "a" * 64

    def tearDown(self):
        self.directory.cleanup()

    def test_migration_idempotent_and_not_added_to_global(self):
        self.assertEqual(self.store.sync(self.device, 119, []), {"personal": 119, "community": 326, "accepted": []})
        self.assertEqual(self.store.sync(self.device, 999, [])["personal"], 119)
        self.assertEqual(self.store.sync("b" * 64, 52, [])["community"], 326)

    def test_concurrent_retries_count_unique_events_only(self):
        ids = [str(uuid.uuid4()) for _ in range(20)]
        with concurrent.futures.ThreadPoolExecutor(max_workers=10) as pool:
            list(pool.map(lambda event: self.store.sync(self.device, 119, [event]), ids * 4))
        self.assertEqual(self.store.sync(self.device, 119, [])["personal"], 139)
        self.assertEqual(self.store.totals()["community"], 346)

    def test_restart_seed_and_legacy_worker_never_reset_new_hits(self):
        self.store.sync(self.device, 119, [str(uuid.uuid4())])
        self.store.observe_legacy(327)
        self.store.observe_legacy(5)
        restarted = CounterStore(self.path, 0)
        self.assertEqual(restarted.totals()["community"], 328)
        backup = Path(self.directory.name) / "backup.sqlite3"
        restarted.backup(backup)
        self.assertEqual(CounterStore(backup).sync(self.device, 0, [])["personal"], 120)

    def test_validation_prevents_invalid_or_unbounded_batches(self):
        for initial in [-1, True, 1.5, "119", 100000001]:
            with self.assertRaises(ValueError): self.store.sync(self.device, initial, [])
        for events in [["bad"], [str(uuid.uuid4())] * 101, None]:
            with self.assertRaises(ValueError): self.store.sync(self.device, 119, events)
        self.assertEqual(self.store.totals()["community"], 326)

    def test_http_origin_validation_and_cors_for_legacy_github_app(self):
        server = ThreadingHTTPServer(("127.0.0.1", 0), make_handler(self.store, {"https://falkinou.github.io"}))
        thread = threading.Thread(target=server.serve_forever, daemon=True); thread.start()
        try:
            url = "http://127.0.0.1:%d/api/counters/sync" % server.server_port
            headers = {"Content-Type": "application/json", "X-Stampfel-Device": self.device, "Origin": "https://falkinou.github.io"}
            data = json.dumps({"legacyCount": 119, "events": []}).encode()
            with urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers)) as response:
                self.assertEqual(response.headers["Access-Control-Allow-Origin"], headers["Origin"])
                self.assertEqual(json.load(response)["personal"], 119)
            headers["Origin"] = "https://unrelated.example"
            with self.assertRaises(urllib.error.HTTPError) as error:
                urllib.request.urlopen(urllib.request.Request(url, data=data, headers=headers))
            self.assertEqual(error.exception.code, 403)
        finally:
            server.shutdown(); server.server_close(); thread.join()


if __name__ == "__main__":
    unittest.main()
