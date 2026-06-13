import uvicorn
from dotenv import load_dotenv

load_dotenv()

if __name__ == "__main__":
    print("="*50)
    print("🐾 INICIANDO SISTEMA COMPLETO MIAU (FULLSTACK) 🐾")
    print("="*50)
    print("Servidor Frontend e Backend unificados na mesma porta.")
    print("Acesse no navegador: http://127.0.0.1:8000")
    print("="*50)
    
    # Inicia o FastAPI (que agora carrega tudo) na porta 8000
    uvicorn.run("backend.main:app", host="127.0.0.1", port=8000, reload=True)
