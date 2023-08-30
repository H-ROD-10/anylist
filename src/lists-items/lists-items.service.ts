import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateListsItemInput } from './dto/create-lists-item.input';
import { UpdateListsItemInput } from './dto/update-lists-item.input';
import { ListsItem } from './entities/lists-item.entity';

@Injectable()
export class ListsItemsService {


  constructor(
    @InjectRepository(ListsItem)
    private readonly listItemRepository: Repository<ListsItem>
  ){}


  async create(createListsItemInput: CreateListsItemInput): Promise<ListsItem> {

    const {itemId, listId, ...rest} = createListsItemInput;


    const newListItem = this.listItemRepository.create({
        ...rest,
        list: { id: listId},
        item: {id: itemId}
    });

    return await this.listItemRepository.save(newListItem)
  }

  findAll() {
    throw new Error('Por implementar');
  }

  findOne(id: number) {
    throw new Error('Por implementar');
  }

  update(id: string, updateListsItemInput: UpdateListsItemInput) {
    throw new Error('Por implementar');
  }

  remove(id: number) {
    throw new Error('Por implementar');
  }
}
