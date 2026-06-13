from fastapi import APIRouter, Depends, HTTPException
import pymysql
from database import get_db
from auth import get_current_user
import schemas
from typing import List

router = APIRouter(dependencies=[Depends(get_current_user)])

# --- TUTORES ---
@router.post(
    "/tutores",
    response_model=schemas.Tutor,
    tags=["Tutores"],
    summary="Cadastrar tutor",
    description="Insere registro na tabela `tutores`.",
)
def create_tutor(tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO tutores (nome, contato, endereco, telefone, foto) VALUES (%s, %s, %s, %s, %s)",
                   (tutor.nome, tutor.contato, tutor.endereco, tutor.telefone, tutor.foto))
    tutor_id = cursor.lastrowid
    return {**tutor.model_dump(), "id": tutor_id}

@router.get(
    "/tutores",
    response_model=List[schemas.Tutor],
    tags=["Tutores"],
    summary="Listar tutores",
    description="Retorna todos os registros da tabela `tutores`.",
)
def read_tutores(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM tutores")
    return cursor.fetchall()

@router.put(
    "/tutores/{tutor_id}",
    response_model=schemas.MessageResponse,
    tags=["Tutores"],
    summary="Atualizar tutor",
    description="Atualiza tutor existente por ID.",
)
def update_tutor(tutor_id: int, tutor: schemas.TutorCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE tutores SET nome=%s, contato=%s, endereco=%s, telefone=%s, foto=%s WHERE id=%s",
                   (tutor.nome, tutor.contato, tutor.endereco, tutor.telefone, tutor.foto, tutor_id))
    return {"message": "Tutor atualizado com sucesso"}

@router.delete(
    "/tutores/{tutor_id}",
    response_model=schemas.MessageResponse,
    tags=["Tutores"],
    summary="Excluir tutor",
    description="Remove tutor por ID (pets vinculados são excluídos em cascata).",
)
def delete_tutor(tutor_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM tutores WHERE id=%s", (tutor_id,))
    return {"message": "Tutor deletado com sucesso"}

# --- PETS ---
@router.post(
    "/pets",
    response_model=schemas.Pet,
    tags=["Pets"],
    summary="Cadastrar pet",
    description="Insere registro na tabela `pets`. Espécie: Cachorro ou Gato.",
)
def create_pet(pet: schemas.PetCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO pets (nome, especie, raca, sexo, tutor_id) VALUES (%s, %s, %s, %s, %s)",
                   (pet.nome, pet.especie, pet.raca, pet.sexo, pet.tutor_id))
    pet_id = cursor.lastrowid
    return {**pet.model_dump(), "id": pet_id}

@router.get(
    "/pets",
    response_model=List[schemas.Pet],
    tags=["Pets"],
    summary="Listar pets",
    description="Retorna todos os registros da tabela `pets`.",
)
def read_pets(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pets")
    return cursor.fetchall()

@router.put(
    "/pets/{pet_id}",
    response_model=schemas.Pet,
    tags=["Pets"],
    summary="Atualizar pet",
    description="Atualiza pet existente por ID.",
)
def update_pet(pet_id: int, pet: schemas.PetCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE pets SET nome=%s, especie=%s, raca=%s, sexo=%s, tutor_id=%s WHERE id=%s",
                   (pet.nome, pet.especie, pet.raca, pet.sexo, pet.tutor_id, pet_id))
    return {**pet.model_dump(), "id": pet_id}

@router.delete(
    "/pets/{pet_id}",
    response_model=schemas.MessageResponse,
    tags=["Pets"],
    summary="Excluir pet",
    description="Remove pet por ID.",
)
def delete_pet(pet_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM pets WHERE id=%s", (pet_id,))
    return {"message": "Pet deletado"}

# --- SERVIÇOS ---
@router.get(
    "/servicos",
    response_model=List[schemas.Servico],
    tags=["Serviços"],
    summary="Listar serviços",
    description="Retorna catálogo da tabela `servicos`.",
)
def read_servicos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM servicos")
    return cursor.fetchall()

@router.post(
    "/servicos",
    response_model=schemas.Servico,
    tags=["Serviços"],
    summary="Cadastrar serviço",
    description="Insere novo serviço com nome, descrição e preço.",
)
def create_servico(serv: schemas.ServicoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO servicos (nome, descricao, preco) VALUES (%s, %s, %s)",
                   (serv.nome, serv.descricao, serv.preco))
    return {**serv.model_dump(), "id": cursor.lastrowid}

@router.put(
    "/servicos/{id}",
    response_model=schemas.Servico,
    tags=["Serviços"],
    summary="Atualizar serviço",
    description="Atualiza serviço existente por ID.",
)
def update_servico(id: int, serv: schemas.ServicoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("UPDATE servicos SET nome=%s, descricao=%s, preco=%s WHERE id=%s",
                   (serv.nome, serv.descricao, serv.preco, id))
    return {**serv.model_dump(), "id": id}

@router.delete(
    "/servicos/{id}",
    response_model=schemas.MessageResponse,
    tags=["Serviços"],
    summary="Excluir serviço",
    description="Remove serviço por ID.",
)
def delete_servico(id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM servicos WHERE id=%s", (id,))
    return {"message": "Serviço deletado"}

# --- AGENDAMENTOS ---
@router.get(
    "/agendamentos",
    response_model=List[schemas.Agendamento],
    tags=["Agendamentos"],
    summary="Listar agendamentos",
    description="Retorna todos os agendamentos com FKs de tutor, pet e serviço.",
)
def read_agendamentos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM agendamentos")
    return cursor.fetchall()

@router.post(
    "/agendamentos",
    response_model=schemas.Agendamento,
    tags=["Agendamentos"],
    summary="Criar agendamento",
    description="Insere agendamento cruzando tutor_id, pet_id e servico_id.",
)
def create_agendamento(agen: schemas.AgendamentoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT tutor_id FROM pets WHERE id=%s", (agen.pet_id,))
    pet = cursor.fetchone()
    if not pet or pet['tutor_id'] != agen.tutor_id:
        raise HTTPException(status_code=400, detail="Pet não pertence ao tutor selecionado")
    cursor.execute("INSERT INTO agendamentos (tutor_id, pet_id, servico_id, data_hora, status) VALUES (%s, %s, %s, %s, %s)",
                   (agen.tutor_id, agen.pet_id, agen.servico_id, agen.data_hora.strftime('%Y-%m-%d %H:%M:%S'), agen.status))
    return {**agen.model_dump(), "id": cursor.lastrowid}

@router.put(
    "/agendamentos/{id}",
    response_model=schemas.Agendamento,
    tags=["Agendamentos"],
    summary="Atualizar agendamento",
    description="Atualiza agendamento existente por ID.",
)
def update_agendamento(id: int, agen: schemas.AgendamentoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT tutor_id FROM pets WHERE id=%s", (agen.pet_id,))
    pet = cursor.fetchone()
    if not pet or pet['tutor_id'] != agen.tutor_id:
        raise HTTPException(status_code=400, detail="Pet não pertence ao tutor selecionado")
    cursor.execute(
        "UPDATE agendamentos SET tutor_id=%s, pet_id=%s, servico_id=%s, data_hora=%s, status=%s WHERE id=%s",
        (agen.tutor_id, agen.pet_id, agen.servico_id, agen.data_hora.strftime('%Y-%m-%d %H:%M:%S'), agen.status, id)
    )
    return {**agen.model_dump(), "id": id}

@router.delete(
    "/agendamentos/{id}",
    response_model=schemas.MessageResponse,
    tags=["Agendamentos"],
    summary="Excluir agendamento",
    description="Remove agendamento por ID.",
)
def delete_agendamento(id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM agendamentos WHERE id=%s", (id,))
    return {"message": "Agendamento deletado"}

# --- AVISOS ---
@router.get(
    "/avisos",
    response_model=List[schemas.Aviso],
    tags=["Avisos"],
    summary="Listar avisos do mural",
    description="Retorna avisos ordenados por `data_criacao` (mais recentes primeiro).",
)
def read_avisos(db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM avisos ORDER BY data_criacao DESC")
    return cursor.fetchall()

@router.post(
    "/avisos",
    response_model=schemas.Aviso,
    tags=["Avisos"],
    summary="Publicar aviso",
    description="Insere aviso na tabela `avisos`. Tipo: Urgente, Aviso ou Lembrete.",
)
def create_aviso(aviso: schemas.AvisoCreate, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO avisos (tipo, mensagem) VALUES (%s, %s)",
                   (aviso.tipo, aviso.mensagem))
    aviso_id = cursor.lastrowid
    return {**aviso.model_dump(), "id": aviso_id}

@router.delete(
    "/avisos/{aviso_id}",
    response_model=schemas.MessageResponse,
    tags=["Avisos"],
    summary="Excluir aviso",
    description="Remove aviso do mural por ID.",
)
def delete_aviso(aviso_id: int, db: pymysql.connections.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM avisos WHERE id=%s", (aviso_id,))
    return {"message": "Aviso deletado"}
