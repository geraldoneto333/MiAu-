from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
import pymysql
from database import get_db
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from datetime import timedelta
import schemas

router = APIRouter(prefix="/auth", tags=["Autenticação"])

@router.post(
    "/register",
    response_model=schemas.Token,
    summary="Registrar novo usuário",
    description="Cria registro na tabela `usuarios` e retorna token JWT.",
)
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

@router.post(
    "/login",
    response_model=schemas.Token,
    summary="Login (obter token JWT)",
    description="Autentica com username/password (form-urlencoded). Use o token em `Authorization: Bearer`.",
)
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

@router.get(
    "/me",
    response_model=schemas.ProfileResponse,
    summary="Obter perfil autenticado",
    description="Retorna username e email do usuário logado. Requer JWT.",
)
def get_me(user = Depends(get_current_user)):
    return {"username": user['username'], "email": user['email']}

@router.put(
    "/me",
    response_model=schemas.MessageResponse,
    summary="Atualizar perfil autenticado",
    description="Atualiza username, email e/ou senha na tabela `usuarios`. Requer JWT.",
)
def update_me(
    data: schemas.ProfileUpdate,
    db: pymysql.connections.Connection = Depends(get_db),
    user = Depends(get_current_user),
):
    cursor = db.cursor()
    new_username = data.username or user['username']
    new_email = data.email or user['email']
    
    query = "UPDATE usuarios SET username=%s, email=%s"
    params = [new_username, new_email]
    
    if data.password:
        query += ", senha_hash=%s"
        params.append(get_password_hash(data.password))
        
    query += " WHERE id=%s"
    params.append(user['id'])
    
    try:
        cursor.execute(query, tuple(params))
        return {"message": "Perfil atualizado com sucesso"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao atualizar: {e}")
