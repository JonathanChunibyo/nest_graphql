// Libraries
import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

// Service
import { AuthenticationService } from './authentication.service';
import { ConfigService } from './config.service';

// Strategies
import { JwtStrategy } from 'src/core/services/strategies/jwt.strategy';

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
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('SECRET_KEY'),
        signOptions: {
          algorithm: 'HS256'
        }
      }),
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mariadb',
        host: configService.get('HOST_DB'),
        port: Number(configService.get('PORT_DB')),
        username: configService.get('USERNAME_DB'),
        password: configService.get('PASSWORD_DB'),
        database: configService.get('DATABASE_DB'),
        synchronize: false,
        autoLoadEntities: true,
        logging: true,
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
    ConfigService,
    JwtStrategy,
    AuthenticationService,
  ],
  exports: [
    ConfigService, 
    JwtStrategy,
    AuthenticationService, 
    TypeOrmModule.forFeature([User]),
  ],
})
export class ConfigModule {}