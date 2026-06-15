import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Aviso } from '../entities/aviso.entity';
import { AvisosController } from './avisos.controller';
import { AvisosService } from './avisos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Aviso])],
  controllers: [AvisosController],
  providers: [AvisosService],
})
export class AvisosModule {}
