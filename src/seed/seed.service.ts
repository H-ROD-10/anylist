import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { ItemsService } from 'src/items/items.service';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { SEED_ITEMS, SEED_USERS } from './data/seed-data';

@Injectable()
export class SeedService {

    private isProd: boolean;


    constructor(
        private readonly configService: ConfigService,

        @InjectRepository(Item)
        private readonly itemRepository: Repository<Item>,

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        private readonly userService: UserService,

        private readonly itemService: ItemsService,
    ){
        this.isProd = configService.get('STATE') === 'prod'
    }

    async excute(){

        if( this.isProd){
            throw new UnauthorizedException('We cannot run SEED on Prod')
        }

        //Borra la base de datos
        await this.deleteRowDataBase()

        //Inserta los usuarios
        const user = await this.loadUsers()

        //Insetar Items
        await this.loadItems(user)


        return true
    }

    async deleteRowDataBase(){


        //borrar item
        await this.itemRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()


        //borrar users
        await this.userRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute()
    }

    async loadUsers(): Promise<User>{

        const users = [];

        for( const user of SEED_USERS){
            users.push(await this.userService.create(user))
        }

        return users[0]

    }
    async loadItems(user: User): Promise<void>{
        const items = [];

        for (const item of SEED_ITEMS){
            items.push(this.itemService.create(item, user))
        }

        await Promise.all(items)

        
        return items[0]
    }
}
