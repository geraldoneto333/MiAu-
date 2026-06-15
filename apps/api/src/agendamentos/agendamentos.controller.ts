import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AgendamentosService } from './agendamentos.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import {
  AgendamentoCreateDto,
  AgendamentoDto,
  MessageResponseDto,
} from '../common/dto';

@ApiTags('Agendamentos')
@ApiBearerAuth('BearerJWT')
@UseGuards(JwtAuthGuard)
@Controller('api/agendamentos')
export class AgendamentosController {
  constructor(private service: AgendamentosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos' })
  findAll(): Promise<AgendamentoDto[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Criar agendamento' })
  create(@Body() dto: AgendamentoCreateDto): Promise<AgendamentoDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar agendamento' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AgendamentoCreateDto,
  ): Promise<AgendamentoDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir agendamento' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.service.remove(id);
  }
}
