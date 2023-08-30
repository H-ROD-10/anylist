import { ObjectType, Field, ID, Float } from '@nestjs/graphql';
import { ListsItem } from 'src/lists-items/entities/lists-item.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, Index, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name:'items'})
@ObjectType()
export class Item {
  
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id: string;

  @Column()
  @Field(() => String)
  name: string;

  //@Column()
  //@Field(() => Float)
  //quantity: number;

  @Column({nullable: true})
  @Field(() => String, {nullable: true})
  quantityUnits?: string; //kg, gr, ml, lts

 
  @ManyToOne(() => User, (user) => user.items, {nullable: false, lazy: true} )
  @Index('userId-index')
  @Field(() => User)
  user: User;

  @OneToMany(() => ListsItem, (listItem) => listItem.item, {lazy: true})
  @Field(() => [ListsItem])
  listItem: ListsItem[]

}
