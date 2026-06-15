import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AvisosService } from './avisos.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { AvisoCreateDto, AvisoDto, MessageResponseDto } from '../common/dto';

@ApiTags('Avisos')
@ApiBearerAuth('BearerJWT')
@UseGuards(JwtAuthGuard)
@Controller('api/avisos')
export class AvisosController {
  constructor(private service: AvisosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar avisos do mural' })
  findAll(): Promise<AvisoDto[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Publicar aviso' })
  create(@Body() dto: AvisoCreateDto): Promise<AvisoDto> {
    return this.service.create(dto);
  }

  @Delete(':aviso_id')
  @ApiOperation({ summary: 'Excluir aviso' })
  remove(@Param('aviso_id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.service.remove(id);
  }
}
