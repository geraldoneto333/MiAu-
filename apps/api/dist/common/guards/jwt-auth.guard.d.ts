import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { Usuario } from '../../entities/usuario.entity';
export declare class JwtAuthGuard implements CanActivate {
    private reflector;
    private jwtService;
    private usuariosRepo;
    constructor(reflector: Reflector, jwtService: JwtService, usuariosRepo: Repository<Usuario>);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
