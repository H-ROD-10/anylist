import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';
import { ListsModule } from 'src/lists/lists.module';

@Module({
  providers: [UserResolver, UserService],
  imports:[
    TypeOrmModule.forFeature([User]), 
    ItemsModule,
    ListsModule
  ],
  exports:[
    TypeOrmModule,
    UserService
  ]
})
export class UserModule {}
