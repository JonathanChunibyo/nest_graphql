// Libraries
import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

// Service
import { AuthenticationService } from './services/authentication.service';
import { EnvironmentService } from './services/environment.service';

// Strategies
import { JwtStrategy } from 'src/core/strategies/jwt.strategy';

// Entities
import { User } from 'src/models/user/entities/user.entity';

@Global()
@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [EnvironmentService],
      useFactory: async (configService: EnvironmentService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          algorithm: 'HS256'
        }
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [EnvironmentService],
      useFactory: (configService: EnvironmentService) => ({
        type: 'mariadb',
        host: configService.get('HOST_DB'),
        port: Number(configService.get('PORT_DB')),
        username: configService.get('USERNAME_DB'),
        password: configService.get('PASSWORD_DB'),
        database: configService.get('DATABASE_DB'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    EnvironmentService,
    JwtStrategy,
    AuthenticationService,
  ],
  exports: [
    EnvironmentService, 
    JwtStrategy,
    AuthenticationService, 
    TypeOrmModule.forFeature([User]),
  ],
})
export class ConfigModule {}