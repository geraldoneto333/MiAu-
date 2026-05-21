import sys
import os
# Adiciona o diretório atual (backend) ao sys.path para garantir que 'routers' e 'database' sejam encontrados
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routers import auth_routes, api_routes

app = FastAPI(
    title="MiAu API REST",
    description="Backend de serviços para o Petshop MiAu com integração ao MariaDB",
    version="1.0.0",
    docs_url="/docs",  # Swagger habilitado na raiz /docs
    redoc_url="/redoc" # Alternativa de docs
)

# Configuração rigorosa de CORS para permitir acesso do nosso frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Para desenvolvimento local (ajuste em prod para o IP do frontend)
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluindo os roteadores da API
app.include_router(auth_routes.router)
app.include_router(api_routes.router, prefix="/api")

# Caminho absoluto para a pasta frontend
FRONTEND_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "frontend")

# Montando o frontend diretamente no FastAPI
if os.path.exists(FRONTEND_DIR):
    # Qualquer requisição que não seja para /api ou /auth vai tentar carregar o frontend
    app.mount("/", StaticFiles(directory=FRONTEND_DIR, html=True), name="frontend")
else:
    @app.get("/", tags=["Home"])
    def root():
        return {"error": "Pasta frontend não encontrada. O sistema está rodando sem a interface gráfica."}
