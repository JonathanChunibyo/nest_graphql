// Libraries
import { Field, ArgsType } from '@nestjs/graphql';

@ArgsType()
export class EntityInput {
    @Field(() => [String], { nullable: true })
    fields?: string[];
}
