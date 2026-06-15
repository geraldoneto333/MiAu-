import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UserCreateDto {
  @ApiProperty({ example: 'ShardCadu' })
  @IsString()
  @MinLength(3)
  username: string;

  @ApiProperty({ example: 'cadu.sport@miau.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'cadu123' })
  @IsString()
  @MinLength(6)
  password: string;
}

export class TokenDto {
  @ApiProperty()
  access_token: string;

  @ApiProperty({ default: 'bearer' })
  token_type: string = 'bearer';
}

export class ProfileResponseDto {
  @ApiProperty()
  username: string;

  @ApiProperty()
  email: string;
}

export class ProfileUpdateDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  username?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  password?: string;
}

export class MessageResponseDto {
  @ApiProperty()
  message: string;
}

export class TutorCreateDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty()
  @IsString()
  contato: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  foto?: string;
}

export class TutorDto extends TutorCreateDto {
  @ApiProperty()
  id: number;
}

export class PetCreateDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiProperty({ enum: ['Cachorro', 'Gato'] })
  @IsEnum(['Cachorro', 'Gato'])
  especie: 'Cachorro' | 'Gato';

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  raca?: string;

  @ApiProperty({ enum: ['M', 'F'] })
  @IsEnum(['M', 'F'])
  sexo: 'M' | 'F';

  @ApiProperty()
  @IsInt()
  tutor_id: number;
}

export class PetDto extends PetCreateDto {
  @ApiProperty()
  id: number;
}

export class ServicoCreateDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  preco: number;
}

export class ServicoDto extends ServicoCreateDto {
  @ApiProperty()
  id: number;
}

export class AgendamentoCreateDto {
  @ApiProperty()
  @IsInt()
  tutor_id: number;

  @ApiProperty()
  @IsInt()
  pet_id: number;

  @ApiProperty()
  @IsInt()
  servico_id: number;

  @ApiProperty()
  @IsString()
  data_hora: string;

  @ApiProperty({ default: 'Agendado' })
  @IsOptional()
  @IsEnum(['Agendado', 'Em Andamento', 'Concluido', 'Cancelado'])
  status?: 'Agendado' | 'Em Andamento' | 'Concluido' | 'Cancelado';
}

export class AgendamentoDto extends AgendamentoCreateDto {
  @ApiProperty()
  id: number;
}

export class AvisoCreateDto {
  @ApiProperty({ enum: ['Urgente', 'Aviso', 'Lembrete'] })
  @IsEnum(['Urgente', 'Aviso', 'Lembrete'])
  tipo: 'Urgente' | 'Aviso' | 'Lembrete';

  @ApiProperty()
  @IsString()
  mensagem: string;
}

export class AvisoDto extends AvisoCreateDto {
  @ApiProperty()
  id: number;

  @ApiPropertyOptional()
  data_criacao?: string;
}
