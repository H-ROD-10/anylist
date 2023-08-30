import { Injectable } from '@nestjs/common';
import { NotFoundException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/serach.args';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateListInput } from './dto/inputs/create-list.input';
import { UpdateListInput } from './dto/inputs/update-list.input';
import { List } from './entities/list.entity';

@Injectable()
export class ListsService {

  constructor(
    @InjectRepository(List)
    private readonly listRepository: Repository<List>
  ){}


  async create(createListInput: CreateListInput, user: User): Promise<List> {

    const newList = this.listRepository.create({...createListInput, user})


    return await this.listRepository.save(newList)
  }

  async findAll(
    user: User, 
    pagination: PaginationArgs, 
    searchArgs: SearchArgs
    ): Promise<List[]> {

    const {limit, offset} = pagination

    const {search} = searchArgs

    const queryBuilder = this.listRepository.createQueryBuilder()
      .take(limit)
      .skip(offset)
      .where(`"userId" = :userId`, {userId: user.id})

      if(search){
        queryBuilder.andWhere('LOWER(name) like :name', {name: `%${ search.toLowerCase()}%`})
      }

      return queryBuilder.getMany()
  }

  async findOne(id: string, user: User): Promise<List> {

    if(!id) throw new NotFoundException('El id no existe')

    const list = await this.listRepository.findOne({
      where: {
        id: id, 
        user: { id: user.id}
      }
    });

    if(!list) throw new NotFoundException('El id no tuyo')

    return list
  }

  async update(id: string, updateListInput: UpdateListInput, user: User): Promise<List> {

    await this.findOne(id, user)

    const list = await this.listRepository.preload(updateListInput)

    if(!list) throw new NotFoundException(`El id: ${id} no existe`)

    return await this.listRepository.save(list);
  }

  async remove(id: string, user: User): Promise<List> {
    const item = await this.findOne(id, user)

    return await this.listRepository.remove({...item, id})
  }

  async count(user:User): Promise<number>{
    return await this.listRepository.count({   
      where:{
        user:{
          id: user.id
        }
      }
    })
  }
}
