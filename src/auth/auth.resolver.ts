import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from '../user/entities/user.entity';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator';
import { LoginInput } from './dtos/input/login.input ';
import { SignupInput } from './dtos/input/signup.input';
import { ValidRoles } from './enums/valid-roles.enum';
import { JwtAuthGuard } from './guards/jwt-auth-guards';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async signup(
    @Args('signupInput') signupInput: SignupInput
  ): Promise<AuthResponse> {
    return await this.authService.signup(signupInput)
  }

  @Mutation(() => AuthResponse, {name:'login'})
  async login(
    @Args('loginInpu') loginInput: LoginInput
  ): Promise<AuthResponse>{
    return await this.authService.signin(loginInput)
  }

  @Query(() => AuthResponse, {name: 'revalidate'})
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser([ValidRoles.admin]) user: User
  ): AuthResponse {
    return this.authService.revalidateToken(user)
  }
}
