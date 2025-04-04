import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateCustomerRequest {
  @MinLength(10)
  @MaxLength(20)
  name: string;

  @IsEmail()
  email: string;
}
