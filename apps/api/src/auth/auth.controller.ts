import {
  Body,
  Controller,
  Get,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Public } from '../common/decorators/public.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AuthUser } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  UserCreateDto,
  TokenDto,
  ProfileResponseDto,
  ProfileUpdateDto,
  MessageResponseDto,
} from '../common/dto';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  async register(@Body() dto: UserCreateDto): Promise<TokenDto> {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login (obter token JWT)' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        username: { type: 'string', example: 'ShardCadu' },
        password: { type: 'string', example: 'cadu123' },
      },
      required: ['username', 'password'],
    },
  })
  async login(@Req() req: Request): Promise<TokenDto> {
    const username = String(req.body?.username ?? '');
    const password = String(req.body?.password ?? '');
    return this.authService.login(username, password);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('BearerJWT')
  @ApiOperation({ summary: 'Obter perfil autenticado' })
  getMe(@CurrentUser() user: AuthUser): ProfileResponseDto {
    return this.authService.getProfile(user);
  }

  @Put('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('BearerJWT')
  @ApiOperation({ summary: 'Atualizar perfil autenticado' })
  updateMe(
    @CurrentUser() user: AuthUser,
    @Body() dto: ProfileUpdateDto,
  ): Promise<MessageResponseDto> {
    return this.authService.updateProfile(user, dto);
  }
}
