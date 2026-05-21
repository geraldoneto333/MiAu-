import http.server
import socketserver
import os

PORT = 3000
# Define a pasta do frontend como diretório base a ser servido
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

def start_server():
    # Permite reutilizar a porta imediatamente se o script for reiniciado
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("="*40)
        print("🐾 SERVIDOR FRONTEND AUMIAU 🐾")
        print("="*40)
        print(f"Servidor rodando localmente na porta {PORT}")
        print(f"Acesse no navegador: http://localhost:{PORT}")
        print("Pressione CTRL+C para parar.")
        print("="*40)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServidor Frontend encerrado.")

if __name__ == "__main__":
    start_server()
