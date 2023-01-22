import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
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

  async findAll(user: User): Promise<Item[]> {
    return await this.itemsRepository.find({
      //relations:{
        //user: true, 
      //},
      where:{
        user: {
          id: user.id
        }
      }
    })
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
