# Colar no Swagger Hub — passo a passo

A API no Swagger Hub **nao atualiza sozinha** quando voce muda o projeto. Siga estes passos **uma vez** (ou sempre que regenerar o spec).

## 1. Regenerar os arquivos (no projeto MiAu)

```bash
python scripts/export_openapi.py
```

Isso gera/atualiza:

- [`openapi.yaml`](openapi.yaml) — **use este no Swagger Hub**
- [`openapi.json`](openapi.json) — Postman, Insomnia

## 2. Copiar o YAML completo

1. Abra **`docs/openapi.yaml`** no Cursor ou VS Code
2. **Ctrl+A** (selecionar tudo)
3. **Ctrl+C** (copiar)

## 3. Substituir no Swagger Hub

1. Acesse [Swagger Hub](https://app.swaggerhub.com) → sua API **miau-api-rest**
2. Clique **Edit** (editor YAML a esquerda)
3. **Ctrl+A** → **Delete** (apague todo o YAML antigo)
4. **Ctrl+V** (cole o conteudo de `openapi.yaml`)
5. Clique **Save** (salve como versao **1.0.1** se pedir)

## 4. Confirmar que funcionou

No editor YAML, busque **`servers`** (Ctrl+F):

```yaml
servers:
  - url: http://127.0.0.1:8000
    description: Local (python app.py)
  - url: https://mi-au.vercel.app
    description: Producao Vercel
```

No preview a direita:

- O aviso *"Try it out is disabled because no servers..."* **some**
- Aparece dropdown **Servers** no topo
- **Try it out** e **Authorize** ficam ativos

## 5. Autorizar e testar

1. Escolha servidor **Producao Vercel** (nao precisa rodar local) ou **Local** (`python app.py`)
2. **Authorize** → **OAuth2PasswordBearer**
   - username: `ShardCadu`
   - password: `cadu123`
   - client_id / client_secret: **vazios**
3. Teste **GET /api/tutores** com **Try it out**

---

Se a busca por `servers` ainda retornar vazio, o YAML antigo nao foi substituir por completo — repita o passo 3.
