import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';
import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth-guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { ItemsService } from 'src/items/items.service';
import { Item } from 'src/items/entities/item.entity';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/serach.args';
import { ListsService } from 'src/lists/lists.service';
import { List } from 'src/lists/entities/list.entity';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly itemService: ItemsService,
    private readonly listsService: ListsService
  ) {}



  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser([ValidRoles.admin]) user: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<User[]> {
    return this.userService.findAll(validRoles.roles, paginationArgs, searchArgs, user);
  }

  @Query(() => User, { name: 'user' })
  async findOne(
    @Args('id', {type: () => ID}, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin, ValidRoles.user]) user: User
    ): Promise<User> {
    return this.userService.findOneById(id);
  }


  @Mutation(() => User, {name: 'blockUser'})
  async blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser([ValidRoles.admin]) user: User
    ): Promise<User> {
    return await this.userService.block(id, user);
  }
  @Mutation(() => User, {name: 'updateUser'})
  async updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUser([ValidRoles.admin]) user: User
  ): Promise<User>{
    return await this.userService.update( updateUserInput.id, updateUserInput, user)
  }

  @ResolveField(() => Int, {name: 'itemCount'})
  async itemCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin]) adminUser: User
  ): Promise<number>{
    return await this.itemService.count(user)
  }

  //DE ESTA FORMA SE INDEPENDIZA EL QUERY DE ITEM DE USER PARA PAGINACION Y BUSQUEDA
  @ResolveField(() => [Item], {name: 'items'})
  async getItemsByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<Item[]>{
    return await this.itemService.findAll(user, paginationArgs, searchArgs)
  }

  @ResolveField(() => [List], {name: 'listByUser'})
  async getlistByUser(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin]) adminUser: User,
    @Args() paginationArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  ): Promise<List[]>{
    return await this.listsService.findAll(user, paginationArgs, searchArgs)
  }


  @ResolveField(() => Int, {name: 'listCount'})
  async listCount(
    @Parent() user: User,
    @CurrentUser([ValidRoles.admin]) adminUser: User
  ): Promise<number>{
    return await this.listsService.count(user) 
  }
}
