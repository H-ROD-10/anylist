import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { User } from "../../user/entities/user.entity";
import { ValidRoles } from "../enums/valid-roles.enum";

export const CurrentUser = createParamDecorator(
    (roles: ValidRoles[] = [], context: ExecutionContext) => {
        const ctx = GqlExecutionContext.create(context);
        const user: User = ctx.getContext().req.user;

        if(!user){
            throw new InternalServerErrorException('No user inside request')
        }

        if(roles.length === 0) return user;

        for(const role of user.roles){
            if(roles.includes(role as ValidRoles)){
                return user
            }
        }

        throw new ForbiddenException(`User ${user.fullName} no esta autorizado para acceder a este recurso`)
    }
)