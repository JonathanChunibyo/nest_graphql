import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
    @Field()
    name: string;

    @Field()
    cellphoneNumber: string;

    @Field()
    nickName: string;

    @Field()
    email: string;

    @Field()
    password: string;

    @Field()
    isState: boolean;
}
