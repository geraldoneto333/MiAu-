import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { Usuario } from '../../entities/usuario.entity';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    @InjectRepository(Usuario)
    private usuariosRepo: Repository<Usuario>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string | undefined;
    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException(
        'Não foi possível validar as credenciais do token JWT',
      );
    }

    const token = authHeader.slice(7);
    try {
      const payload = this.jwtService.verify<{ sub: string }>(token);
      const user = await this.usuariosRepo.findOne({
        where: { username: payload.sub },
        select: ['id', 'username', 'email'],
      });
      if (!user) {
        throw new UnauthorizedException(
          'Não foi possível validar as credenciais do token JWT',
        );
      }
      request.user = user;
      return true;
    } catch {
      throw new UnauthorizedException(
        'Não foi possível validar as credenciais do token JWT',
      );
    }
  }
}
