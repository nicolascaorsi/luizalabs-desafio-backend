import { PartialType } from '@nestjs/mapped-types';
import { CreateCustomerRequest } from './create-customer-request';

export class UpdateCustomerRequest extends PartialType(CreateCustomerRequest) {}
