import { Module } from '@nestjs/common';
import { ListsItemsService } from './lists-items.service';
import { ListsItemsResolver } from './lists-items.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListsItem } from './entities/lists-item.entity';

@Module({
  providers: [ListsItemsResolver, ListsItemsService],
  imports:[
    TypeOrmModule.forFeature([ListsItem])
  ],
  exports:[
    ListsItemsService, TypeOrmModule
  ]
})
export class ListsItemsModule {}
