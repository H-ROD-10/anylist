import { CreateListsItemInput } from './create-lists-item.input';
import { InputType, Field, PartialType, ID } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class UpdateListsItemInput extends PartialType(CreateListsItemInput) {
  @Field(() => ID)
  @IsUUID()
  id: string;
}
