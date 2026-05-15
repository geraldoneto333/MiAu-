from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_routes, api_routes

app = FastAPI(
    title="AuMiau API REST",
    description="Backend de serviços para o Petshop AuMiau com integração ao MariaDB",
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

@app.get("/", tags=["Home"])
def root():
    return {
        "message": "Bem-vindo à API REST do AuMiau!",
        "docs": "Acesse /docs para o Swagger da API"
    }
