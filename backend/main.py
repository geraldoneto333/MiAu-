# Servidor FastAPI unificado: serve API REST e os arquivos estáticos do frontend - [Carlos Eduardo]
# Licença MIT aplicada ao projeto (arquivo LICENSE presente). - [João Paulo]
import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi.staticfiles import StaticFiles
from app_api import app

FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

if os.path.exists(FRONTEND_DIR):
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    @app.get("/", tags=["Home"])
    def root():
        return {"error": "Pasta frontend não encontrada. O sistema está rodando sem a interface gráfica."}
