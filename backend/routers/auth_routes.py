import os
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import pymysql
from database import get_db
from auth import verify_password, get_password_hash, create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES
from datetime import timedelta
import schemas

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post("/register", response_model=schemas.Token)
def register(user: schemas.UserCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE username = %s OR email = %s", (user.username, user.email))
    if cursor.fetchone():
        raise HTTPException(status_code=400, detail="Usuário ou Email já cadastrado no sistema")
        
    senha_texto_puro = get_password_hash(user.password)
    try:
        cursor.execute("INSERT INTO usuarios (username, email, senha_hash) VALUES (%s, %s, %s)",
                       (user.username, user.email, senha_texto_puro))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro no BD: {str(e)}")
        
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM usuarios WHERE username = %s", (form_data.username,))
    user = cursor.fetchone()
    if not user or not verify_password(form_data.password, user['senha_hash']):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuário ou senha incorretos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user['username']}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

from auth import get_current_user

@router.get("/me", tags=["Autenticação"])
def get_me(user = Depends(get_current_user)):
    return {"username": user['username'], "email": user['email']}

@router.put("/me", tags=["Autenticação"])
def update_me(data: dict, db: pymysql.connections.Connection = Depends(get_db), user = Depends(get_current_user)):
    cursor = db.cursor()
    # Atualiza username e email do usuário atual
    new_username = data.get("username", user['username'])
    new_email = data.get("email", user['email'])
    
    query = "UPDATE usuarios SET username=%s, email=%s"
    params = [new_username, new_email]
    
    if "password" in data and data["password"]:
        query += ", senha_hash=%s"
        params.append(get_password_hash(data["password"]))
        
    query += " WHERE id=%s"
    params.append(user['id'])
    
    try:
        cursor.execute(query, tuple(params))
        return {"message": "Perfil atualizado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar: {e}")
