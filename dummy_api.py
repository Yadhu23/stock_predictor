from http.server import BaseHTTPRequestHandler, HTTPServer
import json

class CORSRequestHandler(BaseHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        if self.path.startswith('/predict?stock='):
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({"predicted_price": 420.69}).encode())
        else:
            self.send_response(404)
            self.end_headers()

server = HTTPServer(('127.0.0.1', 8000), CORSRequestHandler)
print("Starting dummy API server on port 8000")
server.serve_forever()
