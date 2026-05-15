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
    Nome: str
    Contato: Optional[str] = None
    Endereco: Optional[str] = None
    Telefone: Optional[str] = None

class TutorCreate(TutorBase):
    pass

class Tutor(TutorBase):
    Id: int

class PetBase(BaseModel):
    Nome: str
    Especie: str
    Raca: Optional[str] = None
    Sexo: Optional[str] = None
    TutorId: int

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    Id: int

class ServicoBase(BaseModel):
    Nome: str
    Descricao: Optional[str] = None
    Preco: float

class ServicoCreate(ServicoBase):
    pass

class Servico(ServicoBase):
    Id: int

class ProdutoBase(BaseModel):
    Nome: str
    Descricao: Optional[str] = None
    Preco: float
    Estoque: int = 0

class ProdutoCreate(ProdutoBase):
    pass

class Produto(ProdutoBase):
    Id: int

class AgendamentoBase(BaseModel):
    TutorId: int
    PetId: int
    ServicoId: int
    DataHora: datetime
    Status: str = 'Pendente'

class AgendamentoCreate(AgendamentoBase):
    pass

class Agendamento(AgendamentoBase):
    Id: int
