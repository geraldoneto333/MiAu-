#!/usr/bin/env python3
"""Exporta docs/openapi.json — delega ao NestJS (use npm run export:openapi)."""
import subprocess
import sys


def main():
    print("Use: npm run export:openapi  (requer NestJS rodando na porta 3001)")
    return subprocess.call(["npm", "run", "export:openapi"])


if __name__ == "__main__":
    sys.exit(main())
