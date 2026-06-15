import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../entities/usuario.entity';
import {
  UserCreateDto,
  TokenDto,
  ProfileUpdateDto,
  ProfileResponseDto,
  MessageResponseDto,
} from '../common/dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  verifyPassword(plain: string, stored: string): boolean {
    return plain === stored;
  }

  hashPassword(password: string): string {
    return password;
  }

  private createToken(username: string): TokenDto {
    const minutes = Number(this.config.get('JWT_EXPIRE_MINUTES', '120'));
    const access_token = this.jwtService.sign(
      { sub: username },
      { expiresIn: minutes * 60 },
    );
    return { access_token, token_type: 'bearer' };
  }

  async register(dto: UserCreateDto): Promise<TokenDto> {
    const existing = await this.usuariosRepo.findOne({
      where: [{ username: dto.username }, { email: dto.email }],
    });
    if (existing) {
      throw new BadRequestException('Usuário ou Email já cadastrado no sistema');
    }

    const user = this.usuariosRepo.create({
      username: dto.username,
      email: dto.email,
      senhaHash: this.hashPassword(dto.password),
    });
    await this.usuariosRepo.save(user);
    return this.createToken(dto.username);
  }

  async login(username: string, password: string): Promise<TokenDto> {
    const user = await this.usuariosRepo.findOne({ where: { username } });
    if (!user || !this.verifyPassword(password, user.senhaHash)) {
      throw new UnauthorizedException('Usuário ou senha incorretos');
    }
    return this.createToken(user.username);
  }

  getProfile(user: { username: string; email: string }): ProfileResponseDto {
    return { username: user.username, email: user.email };
  }

  async updateProfile(
    user: { id: number; username: string; email: string },
    dto: ProfileUpdateDto,
  ): Promise<MessageResponseDto> {
    try {
      await this.usuariosRepo.update(user.id, {
        username: dto.username ?? user.username,
        email: dto.email ?? user.email,
        ...(dto.password
          ? { senhaHash: this.hashPassword(dto.password) }
          : {}),
      });
      return { message: 'Perfil atualizado com sucesso' };
    } catch (e) {
      throw new BadRequestException(`Erro ao atualizar: ${e}`);
    }
  }
}
