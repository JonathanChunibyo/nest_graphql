// Module
import { Module } from '@nestjs/common';
// Resolver
import { UserResolver } from './user.resolver';
// Token
import { getRepositoryToken } from '@nestjs/typeorm';
// Entity
import { User } from './entities/user.entity';
// Service
import { EntityService } from '../service/entity/entity.service';
// DTO
import { CreateUserInput } from './dto/create-user.input';
// DTO
import { UpdateUserInput } from './dto/update-user.input';
// Repository
import { Repository } from 'typeorm';
// Config
import { ConfigModule } from 'src/core/config.module';

@Module({
  imports: [
    ConfigModule
  ],
  providers: [
    UserResolver,
    {
      provide: EntityService,
      useFactory: (userRepository: Repository<User>) => new EntityService<User, CreateUserInput, UpdateUserInput>(userRepository, 'User'),
      inject: [getRepositoryToken(User)]
    },
  ],
})
export class UserModule {}
