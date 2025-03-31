import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { AuthService } from '../business/auth.service';
import { Public } from './decorators/public.decorator';
import { LoginRequest } from './dto/login-request';
import { LoginResponse } from './dto/login-response';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    description:
      'Gera um access token válido para com base no email do customer para ser utilizado na autenticação. Utilizado somente para propósito de testes.',
  })
  @Post('login')
  async login(@Body() request: LoginRequest): Promise<LoginResponse> {
    return await this.authService.login(request);
  }
}
