import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { IsUUID, IsNotEmpty, IsString, IsEmail, IsBoolean, IsArray } from 'class-validator';
import { Item } from 'src/items/entities/item.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


@Entity({name: 'users'})
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  @IsUUID()
  id: string;


  @Column()
  @IsString()
  @IsNotEmpty()
  @Field(() => String)
  fullName: string;

  @Column({unique: true})
  @IsNotEmpty()
  @IsEmail()
  @Field(() => String)
  email: string;

  @Column()
  @IsString()
  //@Field(() => String)
  password: string;

  @Column({
    type: 'text',
    array: true,
    default: ['user']
  })
  @IsArray()
  @Field(() => [String])
  roles: string[];

  @Column({
    type: 'boolean',
    default: true
  })
  @IsBoolean()
  @Field(() => Boolean)
  isActive: boolean;

  @ManyToOne(() => User, (user) => user.lastUpdateByUser, {nullable: true, lazy: true})
  @JoinColumn({name: 'lastUpdateByUser' })
  @Field(()=> User, {nullable: true})
  lastUpdateByUser?: User;

  @OneToMany(()=> Item, (item) => item.user, {lazy: true} )
  @Field( ()=> [Item] )
  items: Item[];

}
