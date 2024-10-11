// Module
import { Module } from '@nestjs/common';
// GraphQL Module
import { GraphQLModule } from '@nestjs/graphql';
// Driver
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
// User Module
import { UserModule } from './models/user/user.module';
// Config Module
import { ConfigModule } from './core/config.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: true
    }),
    UserModule,
    ConfigModule,
  ],
})
export class AppModule {}
