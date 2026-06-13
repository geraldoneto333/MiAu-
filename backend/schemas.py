from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserCreate(BaseModel):
    username: str = Field(..., min_length=3, max_length=50, example="ShardCadu", description="Nome de usuário único")
    email: EmailStr = Field(..., example="cadu.sport@miau.com", description="E-mail único do usuário")
    password: str = Field(..., min_length=6, example="cadu123", description="Senha de acesso")

class Token(BaseModel):
    access_token: str = Field(..., description="Token JWT para Authorization Bearer")
    token_type: str = Field(default="bearer", example="bearer")

class TutorBase(BaseModel):
    nome: str = Field(..., max_length=100, example="João Silva", description="Nome completo do tutor")
    contato: str = Field(..., max_length=50, example="joao@email.com", description="E-mail ou contato principal")
    endereco: Optional[str] = Field(None, max_length=200, example="Rua das Flores, 123", description="Endereço residencial")
    telefone: Optional[str] = Field(None, max_length=20, example="(11) 98888-1111", description="Telefone com DDD")
    foto: Optional[str] = Field(None, description="Foto do tutor em base64 (data URL)")

class TutorCreate(TutorBase):
    pass

class Tutor(TutorBase):
    id: int = Field(..., example=1, description="ID gerado pelo banco (PK)")

class PetBase(BaseModel):
    nome: str = Field(..., max_length=50, example="Rex", description="Nome do pet")
    especie: str = Field(..., example="Cachorro", description="Espécie: Cachorro ou Gato")
    raca: Optional[str] = Field(None, max_length=50, example="Golden Retriever", description="Raça do animal")
    sexo: str = Field(..., example="M", description="Sexo: M (macho) ou F (fêmea)")
    tutor_id: int = Field(..., example=1, description="ID do tutor dono (FK tutores.id)")

class PetCreate(PetBase):
    pass

class Pet(PetBase):
    id: int = Field(..., example=1, description="ID gerado pelo banco (PK)")

class ServicoBase(BaseModel):
    nome: str = Field(..., max_length=100, example="Banho e Tosa", description="Nome do serviço")
    descricao: Optional[str] = Field(None, example="Banho completo com tosa higiênica", description="Descrição detalhada")
    preco: float = Field(..., ge=0, example=89.90, description="Preço em reais (DECIMAL no banco)")

class ServicoCreate(ServicoBase):
    pass

class Servico(ServicoBase):
    id: int = Field(..., example=1, description="ID gerado pelo banco (PK)")

class AgendamentoBase(BaseModel):
    tutor_id: int = Field(..., example=1, description="FK tutores.id")
    pet_id: int = Field(..., example=1, description="FK pets.id")
    servico_id: int = Field(..., example=1, description="FK servicos.id")
    data_hora: datetime = Field(..., example="2026-06-15T14:30:00", description="Data e hora do agendamento")
    status: str = Field(default="Agendado", example="Agendado", description="Agendado | Em Andamento | Concluido | Cancelado")

class AgendamentoCreate(AgendamentoBase):
    pass

class Agendamento(AgendamentoBase):
    id: int = Field(..., example=1, description="ID gerado pelo banco (PK)")

class AvisoBase(BaseModel):
    tipo: str = Field(..., example="Urgente", description="Urgente | Aviso | Lembrete")
    mensagem: str = Field(..., example="Clínica fechará mais cedo hoje.", description="Texto exibido no mural")

class AvisoCreate(AvisoBase):
    pass

class Aviso(AvisoBase):
    id: int = Field(..., example=1, description="ID gerado pelo banco (PK)")
    data_criacao: Optional[datetime] = Field(None, description="Timestamp automático do banco")

class MessageResponse(BaseModel):
    message: str = Field(..., example="Registro deletado com sucesso")

class ProfileResponse(BaseModel):
    username: str = Field(..., example="ShardCadu")
    email: str = Field(..., example="cadu.sport@miau.com")

class ProfileUpdate(BaseModel):
    username: Optional[str] = Field(None, example="ShardCadu")
    email: Optional[str] = Field(None, example="cadu.sport@miau.com")
    password: Optional[str] = Field(None, example="nova_senha", description="Opcional — deixe vazio para manter")
