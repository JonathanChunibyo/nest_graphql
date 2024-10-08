import {Module} from '@nestjs/common';
import {UserResolver} from './user.resolver';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EntityService } from '../service/entity/entity.service';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { Repository } from 'typeorm';
import { ConfigModule } from 'src/core/services/config.module';
//import { ConfigService } from 'src/core/database/config.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
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
