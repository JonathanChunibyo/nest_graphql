import { Global, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { JwtStrategy } from 'src/core/services/strategies/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from './config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

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
  ],
  providers: [
    ConfigService
  ],
  exports: [ConfigService],
})
export class ConfigModule {}