from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TutorBase(BaseModel):
    nome: str
    contato: str
    endereco: Optional[str] = None
    telefone: Optional[str] = None

class TutorCreate(TutorBase):
    pass

class Tutor(TutorBase):
    id: int

class PetBase(BaseModel):
    nome: str
    especie: str
    raca: Optional[str] = None
    sexo: str
    tutor_id: int

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int

class ServicoBase(BaseModel):
    nome: str
    descricao: Optional[str] = None
    preco: float

class ServicoCreate(ServicoBase):
    pass

class Servico(ServicoBase):
    id: int

class AgendamentoBase(BaseModel):
    tutor_id: int
    pet_id: int
    servico_id: int
    data_hora: datetime
    status: str = 'Agendado'

class AgendamentoCreate(AgendamentoBase):
    pass

class Agendamento(AgendamentoBase):
    id: int
