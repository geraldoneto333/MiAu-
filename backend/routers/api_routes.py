from fastapi import APIRouter, Depends, HTTPException
import pymysql
from database import get_db
from auth import get_current_user
import schemas
from typing import List

# TODAS AS ROTAS AQUI EXIGEM O TOKEN JWT VÁLIDO!
router = APIRouter(dependencies=[Depends(get_current_user)])

# --- TUTORES ---
# Rota para cadastrar um novo tutor - [Carlos Eduardo]
@router.post("/tutores", response_model=schemas.Tutor, tags=["Tutores"])
def create_tutor(tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO Tutores (Nome, Contato, Endereco, Telefone) VALUES (%s, %s, %s, %s)",
                   (tutor.Nome, tutor.Contato, tutor.Endereco, tutor.Telefone))
    tutor_id = cursor.lastrowid
    return {**tutor.dict(), "Id": tutor_id}

# Rota para buscar todos os tutores - [Carlos Eduardo]
@router.get("/tutores", response_model=List[schemas.Tutor], tags=["Tutores"])
def read_tutores(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Tutores")
    return cursor.fetchall()

# Rota para atualizar um tutor - [Carlos Eduardo]
@router.put("/tutores/{tutor_id}", tags=["Tutores"])
def update_tutor(tutor_id: int, tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE Tutores SET Nome=%s, Contato=%s, Endereco=%s, Telefone=%s WHERE Id=%s",
                   (tutor.Nome, tutor.Contato, tutor.Endereco, tutor.Telefone, tutor_id))
    return {"message": "Tutor atualizado com sucesso"}

# Rota para deletar um tutor - [Carlos Eduardo]
@router.delete("/tutores/{tutor_id}", tags=["Tutores"])
def delete_tutor(tutor_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM Tutores WHERE Id=%s", (tutor_id,))
    return {"message": "Tutor deletado com sucesso"}

# --- PETS ---
# Rota para cadastrar um novo pet - [Carlos Eduardo]
@router.post("/pets", response_model=schemas.Pet, tags=["Pets"])
def create_pet(pet: schemas.PetCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO Pets (Nome, Especie, Raca, Sexo, TutorId) VALUES (%s, %s, %s, %s, %s)",
                   (pet.Nome, pet.Especie, pet.Raca, pet.Sexo, pet.TutorId))
    pet_id = cursor.lastrowid
    return {**pet.dict(), "Id": pet_id}

# Rota para buscar todos os pets - [Carlos Eduardo]
@router.get("/pets", response_model=List[schemas.Pet], tags=["Pets"])
def read_pets(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM Pets")
    return cursor.fetchall()

# Rota para deletar um pet - [Carlos Eduardo]
@router.delete("/pets/{pet_id}", tags=["Pets"])
def delete_pet(pet_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM Pets WHERE Id=%s", (pet_id,))
    return {"message": "Pet deletado"}

# Funcionalidades de Produtos, Serviços e Agendamentos seguem a mesma lógica (ocultados para simplificação)
