#!/usr/bin/env python3
"""
Live-reload development server with auto browser refresh on file changes.
Usage: python3 dev-server.py
"""

import os
import http.server
import socketserver
import threading
import time
from pathlib import Path
from datetime import datetime

PORT = 8000
WATCH_EXTENSIONS = {'.html', '.css', '.js', '.json'}
file_mtimes = {}
changes = []

# Auto-reload client script injected into HTML
RELOAD_SCRIPT = '''
<script>
(function() {
  let lastCheck = Date.now();
  setInterval(async () => {
    try {
      const response = await fetch('/__live-reload-check', {cache: 'no-store'});
      const data = await response.json();
      if (data.changed && Date.now() - lastCheck > 500) {
        console.log('🔄 Changes detected, reloading...');
        lastCheck = Date.now();
        setTimeout(() => location.reload(), 300);
      }
    } catch(e) {}
  }, 1000);
})();
</script>
'''

def get_watched_files():
    """Get all watchable files."""
    watched = {}
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in {'.git', '.github', 'node_modules', '__pycache__', 'docs'}]
        for file in files:
            ext = Path(file).suffix.lower()
            if ext in WATCH_EXTENSIONS:
                path = os.path.join(root, file)
                try:
                    watched[path] = os.path.getmtime(path)
                except OSError:
                    pass
    return watched

def watch_files():
    """Monitor for file changes."""
    global file_mtimes, changes
    file_mtimes = get_watched_files()
    
    while True:
        time.sleep(0.3)
        current = get_watched_files()
        changed_files = []
        
        for path, mtime in current.items():
            if path not in file_mtimes or file_mtimes[path] != mtime:
                changed_files.append(path)
                print(f"[{datetime.now().strftime('%H:%M:%S')}] 📝 {path}")
        
        if changed_files:
            changes = changed_files
        
        file_mtimes = current

class CustomHTTPHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Handle reload check endpoint
        if self.path == '/__live-reload-check':
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            global changes
            has_changes = len(changes) > 0
            if has_changes:
                changes = []
            self.wfile.write(f'{{"changed": {str(has_changes).lower()}}}'.encode())
            return
        
        # Serve HTML with injected reload script
        if self.path == '/' or self.path.endswith('.html'):
            try:
                path = self.translate_path(self.path)
                if os.path.isdir(path):
                    path = os.path.join(path, 'index.html')
                
                with open(path, 'rb') as f:
                    content = f.read().decode('utf-8')
                    if '</body>' in content:
                        content = content.replace('</body>', RELOAD_SCRIPT + '</body>')
                    elif '</html>' in content:
                        content = content.replace('</html>', RELOAD_SCRIPT + '</html>')
                
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.send_header('Content-Length', len(content.encode()))
                self.send_header('Cache-Control', 'no-cache')
                self.end_headers()
                self.wfile.write(content.encode())
                return
            except Exception:
                self.send_error(404)
                return
        
        super().do_GET()
    
    def log_message(self, format, *args):
        timestamp = datetime.now().strftime('%H:%M:%S')
        print(f"[{timestamp}] {format % args}")

def run_server():
    """Start development server."""
    with socketserver.TCPServer(("", PORT), CustomHTTPHandler) as httpd:
        print(f"\n{'='*50}")
        print(f"🚀 Live Reload Development Server")
        print(f"{'='*50}")
        print(f"📍 http://localhost:{PORT}/")
        print(f"👁️  Watching: {', '.join(WATCH_EXTENSIONS)}")
        print(f"⚡ Auto-reload on save")
        print(f"{'='*50}\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n👋 Server stopped")
            exit(0)

if __name__ == '__main__':
    # Start file watcher
    watcher = threading.Thread(target=watch_files, daemon=True)
    watcher.start()
    
    # Run server
    run_server()
