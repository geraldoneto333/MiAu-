import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Usuario } from '../entities/usuario.entity';
import { UserCreateDto, TokenDto, ProfileUpdateDto, ProfileResponseDto, MessageResponseDto } from '../common/dto';
export declare class AuthService {
    private usuariosRepo;
    private jwtService;
    private config;
    constructor(usuariosRepo: Repository<Usuario>, jwtService: JwtService, config: ConfigService);
    verifyPassword(plain: string, stored: string): boolean;
    hashPassword(password: string): string;
    private createToken;
    register(dto: UserCreateDto): Promise<TokenDto>;
    login(username: string, password: string): Promise<TokenDto>;
    getProfile(user: {
        username: string;
        email: string;
    }): ProfileResponseDto;
    updateProfile(user: {
        id: number;
        username: string;
        email: string;
    }, dto: ProfileUpdateDto): Promise<MessageResponseDto>;
}
