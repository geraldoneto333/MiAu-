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
import { TutoresService } from './tutores.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { TutorCreateDto, TutorDto, MessageResponseDto } from '../common/dto';

@ApiTags('Tutores')
@ApiBearerAuth('BearerJWT')
@UseGuards(JwtAuthGuard)
@Controller('api/tutores')
export class TutoresController {
  constructor(private service: TutoresService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar tutor' })
  create(@Body() dto: TutorCreateDto): Promise<TutorDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar tutores' })
  findAll(): Promise<TutorDto[]> {
    return this.service.findAll();
  }

  @Put(':tutor_id')
  @ApiOperation({ summary: 'Atualizar tutor' })
  update(
    @Param('tutor_id', ParseIntPipe) id: number,
    @Body() dto: TutorCreateDto,
  ): Promise<MessageResponseDto> {
    return this.service.update(id, dto);
  }

  @Delete(':tutor_id')
  @ApiOperation({ summary: 'Excluir tutor' })
  remove(@Param('tutor_id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.service.remove(id);
  }
}
