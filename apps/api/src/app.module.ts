import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import {
  Usuario,
  Tutor,
  Pet,
  Servico,
  Agendamento,
  Aviso,
} from './entities';
import { AuthModule } from './auth/auth.module';
import { TutoresModule } from './tutores/tutores.module';
import { PetsModule } from './pets/pets.module';
import { ServicosModule } from './servicos/servicos.module';
import { AgendamentosModule } from './agendamentos/agendamentos.module';
import { AvisosModule } from './avisos/avisos.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { FastApiExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get('DB_HOST', 'localhost'),
        port: parseInt(config.get('DB_PORT', '3306'), 10),
        username: config.get('DB_USER', 'root'),
        password: config.get('DB_PASSWORD', 'root'),
        database: config.get('DB_NAME', 'miau_db'),
        entities: [Usuario, Tutor, Pet, Servico, Agendamento, Aviso],
        synchronize: false,
      }),
    }),
    AuthModule,
    TutoresModule,
    PetsModule,
    ServicosModule,
    AgendamentosModule,
    AvisosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_FILTER,
      useClass: FastApiExceptionFilter,
    },
  ],
})
export class AppModule {}
