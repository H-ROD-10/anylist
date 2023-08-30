import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'

import { SignupInput } from '../auth/dtos/input/signup.input';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { ValidRoles } from '../auth/enums/valid-roles.enum';
import { PaginationArgs } from 'src/common/dtos/args/pagination.args';
import { SearchArgs } from 'src/common/dtos/args/serach.args';

@Injectable()
export class UserService {

  private logger = new Logger('UserService')

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){}

 async create(signupInput: SignupInput): Promise<User> {
    try {
      const newUser = this.userRepository.create({
        ...signupInput,
        password: bcrypt.hashSync(signupInput.password, 10)
      })

      return await this.userRepository.save(newUser)

    } catch (error) {
      this.handlerDBError(error)
    }
  }

  async findAll(roles: ValidRoles[], paginationArgs: PaginationArgs, searchArgs: SearchArgs, user: User): Promise<User[]> {

    const {limit, offset} = paginationArgs;
    const {search} = searchArgs

    if(roles.length === 0) {
      return await this.userRepository.find({

        //TODO: NO HACE FALTA PORQUE SE UTILIZA lazy en la entidad user
        //relations:{
          //lastUpdateByUser: true
        //}
      })
    }


   return await this.userRepository.createQueryBuilder()
    //ARRAY[roles] se refiere a la columna de users en la base de datos
    //&& ARRAY[:...roles] estos son los roles que envian mediante argumento
    // setParameter('roles', roles) se le pasa el nombre del argumento y los roles que se reciben como parametros
    .take(limit)
    .skip(offset)
    .andWhere('ARRAY[roles] && ARRAY[:...roles]')
    .setParameter('roles', roles)
    .getMany()
    
    //if(search){
      //queryBuilder.andWhere('User.fullName = :fullName', {fullName: `%${ search.toLowerCase()}%`})
      //}
      //.where(`"fullName" = :fullName`, {fullName: user.fullName})
      
    
  }

  async findOneByEmail(email: string): Promise<User> {
   try {
    return await this.userRepository.findOneByOrFail({email})
   } catch (error) {

    throw new NotFoundException('email o password not found')
    //Forma de controlar el error
    //this.handlerDBError({
      //code:'error-001',
      //detail:`${email} o password not found`
    //})
   }
  }

  async findOneById(id: string): Promise<User> {
    try {
     return await this.userRepository.findOneByOrFail({id})
    } catch (error) {
     throw new NotFoundException('El id no existe')
    }
   }

  async update( id: string, updateUserInput: UpdateUserInput, adminUser: User) {
   try {
    const user = await this.userRepository.preload({
      ...updateUserInput,
      id
    })
    user.lastUpdateByUser = user

    return await this.userRepository.save(user)

   } catch (error) {
    this.handlerDBError(error)
   }
  }

  async block(id: string, user: User): Promise<User> {
    const userBlock = await this.findOneById(id)

    userBlock.isActive = false
    userBlock.lastUpdateByUser = user

    return await this.userRepository.save(userBlock)
  }

  

  private handlerDBError(error: any): never {
    if(error.code === '23505'){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    if(error.code === 'error-001'){
      throw new BadRequestException(error.detail.replace('Key ', ''))
    }

    this.logger.error(error);

    throw new InternalServerErrorException('Please check server logs')
  }
}
