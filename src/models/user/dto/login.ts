// GraphQL
import { ObjectType, Field, InputType } from '@nestjs/graphql';

// DTO
import { UpdateUserInput } from './update-user.input';


@ObjectType()
export class AuthResponse extends UpdateUserInput{
  @Field()
  token: string;

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

@InputType()
export class LoginDTO {
  @Field()
  nickName: string;
  @Field()
  password: string;
}