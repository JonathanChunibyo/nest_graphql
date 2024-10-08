import { InputType, Field } from '@nestjs/graphql';
import {CreateUserInput} from './create-user.input';
import {PartialType} from '@nestjs/mapped-types';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true })
  id: string

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  cellphoneNumber: string;

  @Field({ nullable: true })
  nickName: string;

  @Field({ nullable: true })
  email: string;
}
