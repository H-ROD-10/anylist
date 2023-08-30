import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ListsItemsService } from './lists-items.service';
import { ListsItem } from './entities/lists-item.entity';
import { CreateListsItemInput } from './dto/create-lists-item.input';
import { UpdateListsItemInput } from './dto/update-lists-item.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';

@Resolver(() => ListsItem)
@UseGuards(JwtAuthGuard)
export class ListsItemsResolver {
  constructor(private readonly listsItemsService: ListsItemsService) {}

  @Mutation(() => ListsItem)
  createListsItem(
    @Args('createListsItemInput') createListsItemInput: CreateListsItemInput,
    //TODO: Agregar el User para verificar de quien es la lista
  ): Promise<ListsItem> {
    return this.listsItemsService.create(createListsItemInput);
  }

  //@Query(() => [ListsItem], { name: 'listsItems' })
  //findAll() {
    //return this.listsItemsService.findAll();
  //}

 // @Query(() => ListsItem, { name: 'listsItem' })
  //findOne(@Args('id', { type: () => Int }) id: number) {
    //return this.listsItemsService.findOne(id);
 // }

  //@Mutation(() => ListsItem)
  //updateListsItem(@Args('updateListsItemInput') updateListsItemInput: UpdateListsItemInput) {
    //return this.listsItemsService.update(updateListsItemInput.id, updateListsItemInput);
  //}

  //@Mutation(() => ListsItem)
  //removeListsItem(@Args('id', { type: () => Int }) id: number) {
    //return this.listsItemsService.remove(id);
  //}
}
