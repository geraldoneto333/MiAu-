#!/usr/bin/env python3
"""Atalho: inicia Next.js + NestJS (monorepo npm) em vez do FastAPI legado."""
import os
import shutil
import subprocess
import sys

ROOT = os.path.dirname(os.path.abspath(__file__))


def main() -> int:
    npm = shutil.which("npm")
    node = shutil.which("node")

    if not npm or not node:
        print("Erro: Node.js e npm são necessários.")
        print("Instale em https://nodejs.org e rode: npm install")
        return 1

    if not os.path.isfile(os.path.join(ROOT, "node_modules", "concurrently", "package.json")):
        print("Instalando dependências do monorepo...")
        result = subprocess.run([npm, "install"], cwd=ROOT)
        if result.returncode != 0:
            return result.returncode

    print("=" * 50)
    print("🐾 INICIANDO SISTEMA COMPLETO MIAU (Next.js + NestJS) 🐾")
    print("=" * 50)
    print("App:              http://127.0.0.1:3000")
    print("Swagger (UI):     http://127.0.0.1:3000/docs")
    print("OpenAPI JSON:     http://127.0.0.1:3000/openapi.json")
    print("Swagger (debug):  http://127.0.0.1:3001/api-docs")
    print("=" * 50)

    return subprocess.call([npm, "run", "dev"], cwd=ROOT)


if __name__ == "__main__":
    sys.exit(main())
