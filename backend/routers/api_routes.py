from fastapi import APIRouter, Depends
import pymysql
from database import get_db
from auth import get_current_user
import schemas
from typing import List

# TODAS AS ROTAS AQUI EXIGEM O TOKEN JWT VÁLIDO!
router = APIRouter(dependencies=[Depends(get_current_user)])

# --- TUTORES ---
@router.post("/tutores", response_model=schemas.Tutor, tags=["Tutores"])
def create_tutor(tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO tutores (nome, contato, endereco, telefone) VALUES (%s, %s, %s, %s)",
                   (tutor.nome, tutor.contato, tutor.endereco, tutor.telefone))
    tutor_id = cursor.lastrowid
    return {**tutor.dict(), "id": tutor_id}

@router.get("/tutores", response_model=List[schemas.Tutor], tags=["Tutores"])
def read_tutores(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tutores")
    return cursor.fetchall()

@router.put("/tutores/{tutor_id}", tags=["Tutores"])
def update_tutor(tutor_id: int, tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE tutores SET nome=%s, contato=%s, endereco=%s, telefone=%s WHERE id=%s",
                   (tutor.nome, tutor.contato, tutor.endereco, tutor.telefone, tutor_id))
    return {"message": "Tutor atualizado com sucesso"}

@router.delete("/tutores/{tutor_id}", tags=["Tutores"])
def delete_tutor(tutor_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM tutores WHERE id=%s", (tutor_id,))
    return {"message": "Tutor deletado com sucesso"}

# --- PETS ---
@router.post("/pets", response_model=schemas.Pet, tags=["Pets"])
def create_pet(pet: schemas.PetCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO pets (nome, especie, raca, sexo, tutor_id) VALUES (%s, %s, %s, %s, %s)",
                   (pet.nome, pet.especie, pet.raca, pet.sexo, pet.tutor_id))
    pet_id = cursor.lastrowid
    return {**pet.dict(), "id": pet_id}

@router.get("/pets", response_model=List[schemas.Pet], tags=["Pets"])
def read_pets(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pets")
    return cursor.fetchall()

@router.put("/pets/{pet_id}", response_model=schemas.Pet, tags=["Pets"])
def update_pet(pet_id: int, pet: schemas.PetCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE pets SET nome=%s, especie=%s, raca=%s, sexo=%s, tutor_id=%s WHERE id=%s",
                   (pet.nome, pet.especie, pet.raca, pet.sexo, pet.tutor_id, pet_id))
    return {**pet.dict(), "id": pet_id}

@router.delete("/pets/{pet_id}", tags=["Pets"])
def delete_pet(pet_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM pets WHERE id=%s", (pet_id,))
    return {"message": "Pet deletado"}

# --- SERVIÇOS ---
@router.get("/servicos", response_model=List[schemas.Servico], tags=["Serviços"])
def read_servicos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM servicos")
    return cursor.fetchall()

@router.delete("/servicos/{id}", tags=["Serviços"])
def delete_servico(id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM servicos WHERE id=%s", (id,))
    return {"message": "Serviço deletado"}

@router.post("/servicos", response_model=schemas.Servico, tags=["Serviços"])
def create_servico(serv: schemas.ServicoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO servicos (nome, descricao, preco) VALUES (%s, %s, %s)",
                   (serv.nome, serv.descricao, serv.preco))
    return {**serv.dict(), "id": cursor.lastrowid}

# --- AGENDAMENTOS ---
@router.get("/agendamentos", tags=["Agendamentos"])
def read_agendamentos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM agendamentos")
    return cursor.fetchall()

@router.delete("/agendamentos/{id}", tags=["Agendamentos"])
def delete_agendamento(id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM agendamentos WHERE id=%s", (id,))
    return {"message": "Agendamento deletado"}

@router.post("/agendamentos", response_model=schemas.Agendamento, tags=["Agendamentos"])
def create_agendamento(agen: schemas.AgendamentoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO agendamentos (tutor_id, pet_id, servico_id, data_hora, status) VALUES (%s, %s, %s, %s, %s)",
                   (agen.tutor_id, agen.pet_id, agen.servico_id, agen.data_hora.strftime('%Y-%m-%d %H:%M:%S'), agen.status))
    return {**agen.dict(), "id": cursor.lastrowid}

# --- AVISOS ---
@router.get("/avisos", response_model=List[schemas.Aviso], tags=["Avisos"])
def read_avisos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM avisos ORDER BY data_criacao DESC")
    return cursor.fetchall()

@router.post("/avisos", response_model=schemas.Aviso, tags=["Avisos"])
def create_aviso(aviso: schemas.AvisoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO avisos (tipo, mensagem) VALUES (%s, %s)",
                   (aviso.tipo, aviso.mensagem))
    aviso_id = cursor.lastrowid
    return {**aviso.dict(), "id": aviso_id}

@router.delete("/avisos/{aviso_id}", tags=["Avisos"])
def delete_aviso(aviso_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM avisos WHERE id=%s", (aviso_id,))
    return {"message": "Aviso deletado"}
