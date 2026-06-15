import { Request } from 'express';
import { AuthService } from './auth.service';
import { AuthUser } from '../common/decorators/public.decorator';
import { UserCreateDto, TokenDto, ProfileResponseDto, ProfileUpdateDto, MessageResponseDto } from '../common/dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(dto: UserCreateDto): Promise<TokenDto>;
    login(req: Request): Promise<TokenDto>;
    getMe(user: AuthUser): ProfileResponseDto;
    updateMe(user: AuthUser, dto: ProfileUpdateDto): Promise<MessageResponseDto>;
}
