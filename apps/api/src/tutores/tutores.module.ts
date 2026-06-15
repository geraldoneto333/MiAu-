import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tutor } from '../entities/tutor.entity';
import { TutoresController } from './tutores.controller';
import { TutoresService } from './tutores.service';

@Module({
  imports: [TypeOrmModule.forFeature([Tutor])],
  controllers: [TutoresController],
  providers: [TutoresService],
})
export class TutoresModule {}
