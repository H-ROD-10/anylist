import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from 'apollo-server-core';
import { ItemsModule } from './items/items.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';
import { SeedModule } from './seed/seed.module';
import { CommonModule } from './common/common.module';
import { ListsModule } from './lists/lists.module';
import { ListsItemsModule } from './lists-items/lists-items.module';


@Module({
  imports: [
    ConfigModule.forRoot(),

    GraphQLModule.forRootAsync({
      driver: ApolloDriver,
      imports:[AuthModule],
      inject:[JwtService],
      useFactory: async(jwtService:JwtService)=>{
        return {
          playground: false,
          autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
          plugins: [
            ApolloServerPluginLandingPageLocalDefault()
          ],
          context({req}){
            //const token = req.headers.authorization?.replace('Bearer ', '')
            //if(!token) throw new Error('Token needed')


            //const payload = jwtService.decode(token)
            //if(!payload) throw new Error('Token not valid')
          }
        }
      }
    }),

    //TODO CONFIG BASIC
    //GraphQLModule.forRoot<ApolloDriverConfig>({
      //driver: ApolloDriver,
      //playground: false,
      //autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      //plugins: [ApolloServerPluginLandingPageLocalDefault()],
   // }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ItemsModule,
    UserModule,
    AuthModule,
    SeedModule,
    CommonModule,
    ListsModule,
    ListsItemsModule,
  ],
  providers: [],
})
export class AppModule {}
