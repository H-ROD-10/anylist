import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { User } from './entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ItemsModule } from 'src/items/items.module';

@Module({
  providers: [UserResolver, UserService],
  imports:[
    TypeOrmModule.forFeature([User]),
    ItemsModule
  ],
  exports:[
    TypeOrmModule,
    UserService
  ]
})
export class UserModule {}
