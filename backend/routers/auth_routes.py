import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import pymysql
from database import get_db
from auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import schemas

router = APIRouter(prefix="/auth", tags=["Autenticação"])

# Rota de Registro de novo usuário - [Carlos Eduardo]
@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Usuarios WHERE Username = %s OR Email = %s", (user.username, user.email))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Usuário ou Email já cadastrado no sistema")
        
    senha_texto_puro = get_password_hash(user.password) # Que agora apenas retorna a senha
    try:
        cursor.execute("INSERT INTO Usuarios (Username, Email, Senha) VALUES (%s, %s, %s)",
                       (user.username, user.email, senha_texto_puro))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no BD: {str(e)}")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Rota de Login que gera o token JWT - [Carlos Eduardo]
@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Usuarios WHERE Username = %s", (form_data.username,))
    user = cursor.fetchone()
    if not user or not verify_password(form_data.password, user['Senha']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['Username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}
