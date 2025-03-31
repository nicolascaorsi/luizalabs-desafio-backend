import { PartialType } from '@nestjs/swagger';
import { CreateCustomerRequest } from './create-customer-request';

export class UpdateCustomerRequest extends PartialType(CreateCustomerRequest) {}
