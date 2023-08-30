import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { ListsItem } from 'src/lists-items/entities/lists-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'lists'})
@ObjectType()
export class List {

  @PrimaryGeneratedColumn('uuid')
  @IsUUID()
  @Field(() => ID)
  id: string

  @Column()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  name: string;

  @ManyToOne(() => User, (user) => user.lists, { lazy: true} )
  @Index('userId-list-item')
  @Field(() => User)
  user: User;

  @OneToMany(()=> ListsItem, (listItem) => listItem.list, {lazy: true})
  @Field(()=> [ListsItem])
  listItem: ListsItem;
}
