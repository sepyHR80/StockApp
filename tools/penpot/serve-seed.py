from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


class SeedHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


if __name__ == "__main__":
    plugin_dir = Path(__file__).resolve().parent / "seed"
    handler = partial(SeedHandler, directory=str(plugin_dir))
    with ThreadingHTTPServer(("127.0.0.1", 41783), handler) as server:
        server.serve_forever()
