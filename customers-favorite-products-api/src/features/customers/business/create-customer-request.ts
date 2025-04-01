import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class CreateCustomerRequest {
  @MinLength(10)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;
}
