import { ArgsType, Field, Int } from "@nestjs/graphql";
import { IsNumber, IsOptional, Min } from "class-validator";

@ArgsType()
export class PaginationArgs {

    @Field(() => Int, {nullable: true})
    @Min(0)
    @IsNumber()
    @IsOptional()
    offset: number = 0;

    @Field(() => Int, {nullable: true})
    @Min(1)
    @IsNumber()
    @IsOptional()
    limit: number = 10;

}