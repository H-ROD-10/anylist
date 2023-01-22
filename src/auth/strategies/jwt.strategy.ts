import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "../../user/entities/user.entity";
import { AuthService } from "../auth.service";
import { IJwtPayload } from "../interface/jwt-payload.interface";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy){
    constructor(
        configService: ConfigService,
        private readonly authService: AuthService
    ){
        super({
            secretOrKey: configService.get('JWT_SECRET'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload: IJwtPayload): Promise<User>{

        const {id} = payload

        return await this.authService.validateUser(id)
        
    }
}