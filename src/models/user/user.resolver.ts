// GraphQL
import { Resolver, Query, Mutation, Args, ArgsType, Field } from '@nestjs/graphql';
// Service
import { EntityService } from '../service/entity/entity.service';
// DTO
import { CreateUserInput } from './dto/create-user.input';
// DTO
import { UpdateUserInput } from './dto/update-user.input';
// Entity
import { User } from './entities/user.entity';
// Repository
import { InjectRepository } from '@nestjs/typeorm';
// Repository
import { Repository } from 'typeorm';
// Input
import { EntityInput } from '../service/entity/entity.input';
// Decorator
import { Auth } from 'src/core/decorators/auth.decorators';
// Enum
import { ModuleEnum } from 'src/core/enums/modules.enums';
// Service
import { AuthenticationService } from 'src/core/services/authentication.service';
// Exception
import { UnauthorizedException } from '@nestjs/common';
// Message
import * as messageError from './message/error.user.json';
// Library
import * as argon2 from 'argon2';
// DTO
import { AuthResponse, LoginDTO } from './dto/login';

@ArgsType()
class UserFieldsArgs extends EntityInput{
  @Field()
  validation?: UpdateUserInput;
}

@Resolver(() => User)
export class UserResolver {
  private readonly userService: EntityService<User, CreateUserInput, UpdateUserInput>;

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly authenticationService: AuthenticationService
  ) {
    this.userService = new EntityService<User, CreateUserInput, UpdateUserInput>(this.userRepository, 'User');
  }

  @Mutation(() => User) 
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    const { password: passwordEntered, ...additionalUserData } = createUserInput;
    const hashedPassword = await argon2.hash(passwordEntered)
    await this.userService.create({ ...additionalUserData, password: hashedPassword });
    return additionalUserData;
  }

  @Mutation(() => AuthResponse) 
  async login(@Args('loginUser') loginDTO: LoginDTO) {
    const { nickName, password } = loginDTO;
    const queryBuilder = this.userService.find();
    const userValidation = await queryBuilder.where({ nickName }).getOne();
    if(!userValidation) throw new UnauthorizedException(messageError.userDoesNotExist);
    const passwordCompare = await this.authenticationService.comparePasswords(password, userValidation.password);
    if (passwordCompare) {
      const token = this.authenticationService.getJwtToken({ id: userValidation.id });
      const { password, ...userData } = userValidation;
      return { ...userData, token };
    }
    throw new UnauthorizedException(messageError.passwordIncorrect);
  }

  @Auth([ModuleEnum.DEFAULT])
  @Query(() => [User])
  async userList(@Args() fieldsArgs: UserFieldsArgs) {
    const { fields, validation } = fieldsArgs;
    const queryBuilder = this.userService.find();
    return await queryBuilder.select(fields).where(validation).getMany();
  }

  @Query(() => User)
  async user(@Args() fieldsArgs: UserFieldsArgs) {
    const { fields, validation } = fieldsArgs;
    const queryBuilder = this.userService.find();
    return await queryBuilder.select(fields).where(validation).getOne();
  }

  @Mutation(() => User)
  update(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.userService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  remove(@Args('id') id: number) {
    return this.userService.remove(id);
  }
}
