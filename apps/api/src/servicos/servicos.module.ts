import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Servico } from '../entities/servico.entity';
import { ServicosController } from './servicos.controller';
import { ServicosService } from './servicos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Servico])],
  controllers: [ServicosController],
  providers: [ServicosService],
})
export class ServicosModule {}
