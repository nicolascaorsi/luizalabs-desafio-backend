import { CustomersService } from '@customers/business/customers.service';
import { NotFoundError } from '@errors/not-found-error';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenData } from './token-data';

export type LoginRequest = { email: string };
export type LoginResponse = {
  accessToken: string;
};

@Injectable()
export class AuthService {
  constructor(
    private customerService: CustomersService,
    private jwtService: JwtService,
  ) {}

  async login({ email }: LoginRequest): Promise<LoginResponse> {
    const customer = await this.customerService.find({ email });
    if (!customer) {
      throw new NotFoundError('Usuário não encontrado');
    }

    const payload: TokenData = { sub: customer.id, user: customer };
    return {
      accessToken: await this.jwtService.signAsync(payload),
    };
  }
}
