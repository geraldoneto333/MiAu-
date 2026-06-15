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
import { ServicosService } from './servicos.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { ServicoCreateDto, ServicoDto, MessageResponseDto } from '../common/dto';

@ApiTags('Serviços')
@ApiBearerAuth('BearerJWT')
@UseGuards(JwtAuthGuard)
@Controller('api/servicos')
export class ServicosController {
  constructor(private service: ServicosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar serviços' })
  findAll(): Promise<ServicoDto[]> {
    return this.service.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar serviço' })
  create(@Body() dto: ServicoCreateDto): Promise<ServicoDto> {
    return this.service.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar serviço' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ServicoCreateDto,
  ): Promise<ServicoDto> {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Excluir serviço' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.service.remove(id);
  }
}
