#!/usr/bin/env python3
# local_server.py - simple bridge to run AutoHotkey actions on Windows
# Usage: python local_server.py
# This server listens on port 5000 by default and accepts requests like:
# /run?action=open_url&url=https%3A%2F%2Fyoutube.com
# It will launch an action by calling actions.ahk with args.
#
# SECURITY: Only run this on your local machine. Do NOT expose this port publicly.

from http.server import BaseHTTPRequestHandler, HTTPServer
import urllib.parse as up
import subprocess
import os

HOST = '0.0.0.0'
PORT = 5000
AHK_PATH = os.path.join(os.path.dirname(__file__), 'actions.ahk')

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = up.urlparse(self.path)
        qs = up.parse_qs(parsed.query)
        action = qs.get('action', [''])[0]
        # optional url parameter
        url = qs.get('url', [''])[0]
        if not action:
            self.send_response(400)
            self.end_headers()
            self.wfile.write(b'No action specified')
            return
        # sanitize action names
        safe = ''.join(ch for ch in action if ch.isalnum() or ch in '_:-./')
        try:
            # call AutoHotkey passing action and optional url
            cmd = ['AutoHotkey', AHK_PATH, safe, url]
            # On systems where autohotkey.exe isn't in PATH, ask user to adjust AHK path or use full path
            subprocess.Popen(cmd, shell=False)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b'Launched: ' + safe.encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.end_headers()
            self.wfile.write(str(e).encode('utf-8'))

if __name__ == '__main__':
    print(f'Starting local bridge on http://{HOST}:{PORT} - press Ctrl+C to stop')
    server = HTTPServer((HOST, PORT), Handler)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.server_close()
