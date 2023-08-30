import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/serach.args';
import { User } from 'src/user/entities/user.entity';
import { Like, Repository } from 'typeorm';
import { CreateItemInput } from './dto/input/create-item.input';
import { UpdateItemInput } from './dto/input/update-item.input';
import { Item } from './entities/item.entity';

@Injectable()
export class ItemsService {

  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>
  ){}

  async create(createItemInput: CreateItemInput, user: User): Promise<Item> {
    const newItem = this.itemsRepository.create({...createItemInput, user})

    return await this.itemsRepository.save(newItem)
  }

  async findAll(
    user: User, 
    pagination: PaginationArgs, 
    searchArgs: SearchArgs
    ): Promise<Item[]> {

    const {limit, offset} = pagination

    const {search} = searchArgs

    const queryBuilder = this.itemsRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, {userId: user.id})

      if(search){
        queryBuilder.andWhere('LOWER(name) like :name', {name: `%${ search.toLowerCase()}%`})
      }

      return queryBuilder.getMany()

    //return await this.itemsRepository.find({
      //relations:{
        //user: true, 
      //},
      //take: limit,
      //skip: offset,
      //where:{
        //user: {
          //id: user.id
        //},
        //name: Like(`%${search}%`)
      //}
    //})

  
  }

  async findOne(id: string, user: User): Promise<Item> {

    if(!id) throw new NotFoundException('El id no existe')

    const item = await this.itemsRepository.findOne({
      //relations:{
        //user: true, 
      //},
      where: {
        id: id, 
        user: { id: user.id}
      }
    });

    if(!item) throw new NotFoundException('El id no tuyo')

    return item
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User): Promise<Item> {

    await this.findOne(id, user)

    const item = await this.itemsRepository.preload(updateItemInput)

    if(!item) throw new NotFoundException(`El id: ${id} no existe`)

    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User): Promise<Item> {
    const item = await this.findOne(id, user)

    return await this.itemsRepository.remove({...item, id})
  }

  async count(user:User): Promise<number>{
    return await this.itemsRepository.count({   
      where:{
        user:{
          id: user.id
        }
      }
    })
  }
}
