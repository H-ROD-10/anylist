import { BadRequestException, Injectable } from '@nestjs/common';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LoginInput } from './dtos/input/login.input ';
import { SignupInput } from './dtos/input/signup.input';
import { AuthResponse } from './types/auth-response.type';

@Injectable()
export class AuthService {


    constructor(
        private readonly userServices: UserService,
        private readonly jwtService: JwtService
    ){}

    private getJwtToken(userId: string){
        return this.jwtService.sign({id: userId})
    }

    async signup(signupInput: SignupInput): Promise<AuthResponse>{

        const user = await this.userServices.create(signupInput);

        //TODO: Implementar Token
        const token = this.getJwtToken( user.id)
        
        return {
            token,
            user
        }
    }

    async signin(loginInpu: LoginInput): Promise<AuthResponse>{

        const user = await this.userServices.findOneByEmail(loginInpu.email)

        if( !bcrypt.compareSync(loginInpu.password, user.password) ){
            throw new BadRequestException('Email o password incorrectos')
        }
        
        const token = this.getJwtToken( user.id)
        
        return {
            token,
            user
        }
    }

    async validateUser(id: string): Promise<User>{
      
     const user = await this.userServices.findOneById(id)

     if(!user.isActive) throw new UnauthorizedException("Usuario inactivo, contactar con la administracion")

     delete user.password;

     
     return user;
       
    }

    revalidateToken(user:User): AuthResponse {
        const token = this.getJwtToken( user.id)

        return {
            token,
            user
        }
    }
}
