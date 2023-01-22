import { CreateUserInput } from './create-user.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsArray, IsBoolean, IsOptional, IsString, IsUUID } from 'class-validator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { User } from '../entities/user.entity';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;

  @Field(() => [ValidRoles], {nullable: true})
  @IsArray()
  @IsOptional()
  roles?: ValidRoles[];

  @Field(()=> Boolean, {nullable: true})
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(()=> String, {nullable: true})
  @IsString()
  @IsOptional()
  password?: string

}
