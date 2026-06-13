#!/usr/bin/env python3
"""Exporta docs/openapi.json e docs/openapi.yaml para Swagger Hub / Postman."""
import json
import os
import subprocess
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BACKEND = os.path.join(ROOT, "backend")
DOCS = os.path.join(ROOT, "docs")
sys.path.insert(0, BACKEND)

from app_api import app  # noqa: E402
from openapi_config import enrich_openapi_schema  # noqa: E402

OUTPUT_JSON = os.path.join(DOCS, "openapi.json")
OUTPUT_YAML = os.path.join(DOCS, "openapi.yaml")


def ensure_pyyaml():
    try:
        import yaml  # noqa: F401
    except ImportError:
        subprocess.check_call([sys.executable, "-m", "pip", "install", "pyyaml"])
    import yaml
    return yaml


def reorder_spec(spec: dict) -> dict:
    """Coloca servers logo após info (ordem legível no Swagger Hub)."""
    ordered = {
        "openapi": spec.get("openapi", "3.0.3"),
        "info": spec.get("info", {}),
        "servers": spec.get("servers", []),
        "paths": spec.get("paths", {}),
        "components": spec.get("components", {}),
        "tags": spec.get("tags", []),
    }
    if "externalDocs" in spec:
        ordered["externalDocs"] = spec["externalDocs"]
    return ordered


def main():
    spec = reorder_spec(enrich_openapi_schema(app.openapi()))

    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(spec, f, ensure_ascii=False, indent=2)
        f.write("\n")

    yaml = ensure_pyyaml()
    with open(OUTPUT_YAML, "w", encoding="utf-8") as f:
        yaml.dump(
            spec,
            f,
            allow_unicode=True,
            sort_keys=False,
            default_flow_style=False,
            width=120,
        )

    print(f"OpenAPI JSON: {OUTPUT_JSON}")
    print(f"OpenAPI YAML: {OUTPUT_YAML}")
    print(f"servers: {len(spec.get('servers', []))} entradas")
    for s in spec.get("servers", []):
        print(f"  - {s.get('url')}")


if __name__ == "__main__":
    main()
