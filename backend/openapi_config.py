"""Metadados extras do OpenAPI para Swagger UI / Swagger Editor / Postman."""

OPENAPI_SERVERS = [
    {
        "url": "http://127.0.0.1:8000",
        "description": "Local (python app.py)",
    },
    {
        "url": "https://mi-au.vercel.app",
        "description": "Producao Vercel",
    },
]

OPENAPI_EXTERNAL_DOCS = {
    "description": "Guia completo da API (Markdown)",
    "url": "https://github.com/Dev-Carlos-Alves/MiAu-/blob/main/docs/API-Swagger.md",
}


def enrich_openapi_schema(spec: dict) -> dict:
    """Completa o spec para importação em ferramentas externas sem avisos."""
    # SwaggerHub / Swagger Editor: OpenAPI 3.0.3 evita avisos de validação do 3.1
    spec["openapi"] = "3.0.3"
    spec["servers"] = OPENAPI_SERVERS
    spec["externalDocs"] = OPENAPI_EXTERNAL_DOCS

    info = spec.setdefault("info", {})
    info.setdefault("contact", {
        "name": "Carlos Eduardo (Cadu)",
        "url": "https://github.com/Dev-Carlos-Alves/MiAu-",
    })
    info.setdefault("license", {
        "name": "Projeto Acadêmico — Henning 2026.1",
    })

    components = spec.setdefault("components", {})
    security_schemes = components.setdefault("securitySchemes", {})

    oauth2 = security_schemes.setdefault("OAuth2PasswordBearer", {
        "type": "oauth2",
        "flows": {"password": {"scopes": {}, "tokenUrl": "/auth/login"}},
    })
    oauth2["description"] = (
        "Autenticação JWT. No Authorize, use username `ShardCadu` e password `cadu123`. "
        "Deixe client_id e client_secret vazios. Rotas /api/* exigem token."
    )
    flow = oauth2.setdefault("flows", {}).setdefault("password", {})
    flow["tokenUrl"] = "/auth/login"
    flow.setdefault("scopes", {})

    security_schemes["BearerJWT"] = {
        "type": "http",
        "scheme": "bearer",
        "bearerFormat": "JWT",
        "description": (
            "Alternativa manual: faça POST /auth/login, copie access_token e cole aqui "
            "(apenas o token, sem a palavra Bearer)."
        ),
    }

    return spec
