import sys
import os

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from routers import auth_routes, api_routes
from openapi_tags import OPENAPI_TAGS, API_DESCRIPTION
from openapi_config import enrich_openapi_schema, OPENAPI_SERVERS

app = FastAPI(
    title="MiAu API REST",
    description=API_DESCRIPTION,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    openapi_tags=OPENAPI_TAGS,
    servers=OPENAPI_SERVERS,
    contact={
        "name": "Carlos Eduardo (Cadu)",
        "url": "https://github.com/Dev-Carlos-Alves/MiAu-",
    },
    license_info={
        "name": "Projeto Acadêmico — Henning 2026.1",
    },
)


def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title=app.title,
        version=app.version,
        description=app.description,
        routes=app.routes,
        tags=app.openapi_tags,
        servers=app.servers,
    )
    app.openapi_schema = enrich_openapi_schema(openapi_schema)
    return app.openapi_schema


app.openapi = custom_openapi

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(api_routes.router, prefix="/api")
