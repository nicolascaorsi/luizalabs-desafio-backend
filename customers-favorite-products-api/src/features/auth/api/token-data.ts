import { Customer } from '@customers/domain/customer.entity';

export type TokenData = { sub: string; user: Customer };
