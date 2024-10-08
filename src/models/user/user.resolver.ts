import {Resolver, Query, Mutation, Args, ArgsType, Field} from '@nestjs/graphql';
import {EntityService} from '../service/entity/entity.service';
import {CreateUserInput} from './dto/create-user.input';
import {UpdateUserInput} from './dto/update-user.input';
import {User} from './entities/user.entity'
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EntityInput } from '../service/entity/entity.input';
import { Auth } from 'src/decorators/auth.decorators';
import { ModuleEnum } from 'src/enums/modules.enums';

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
  ) {
    this.userService = new EntityService<User, CreateUserInput, UpdateUserInput>(this.userRepository, 'User');
  }

  @Mutation(() => User) 
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.create(createUserInput);
  }

  //@Auth([ModuleEnum.DEFAULT])
  @Query(() => [User])
  async userList(@Args() fieldsArgs: UserFieldsArgs) {
    const { fields, validation } = fieldsArgs;
    console.log(fields)
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
