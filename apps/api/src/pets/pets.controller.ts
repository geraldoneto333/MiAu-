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
import { PetsService } from './pets.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PetCreateDto, PetDto, MessageResponseDto } from '../common/dto';

@ApiTags('Pets')
@ApiBearerAuth('BearerJWT')
@UseGuards(JwtAuthGuard)
@Controller('api/pets')
export class PetsController {
  constructor(private service: PetsService) {}

  @Post()
  @ApiOperation({ summary: 'Cadastrar pet' })
  create(@Body() dto: PetCreateDto): Promise<PetDto> {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar pets' })
  findAll(): Promise<PetDto[]> {
    return this.service.findAll();
  }

  @Put(':pet_id')
  @ApiOperation({ summary: 'Atualizar pet' })
  update(
    @Param('pet_id', ParseIntPipe) id: number,
    @Body() dto: PetCreateDto,
  ): Promise<PetDto> {
    return this.service.update(id, dto);
  }

  @Delete(':pet_id')
  @ApiOperation({ summary: 'Excluir pet' })
  remove(@Param('pet_id', ParseIntPipe) id: number): Promise<MessageResponseDto> {
    return this.service.remove(id);
  }
}
