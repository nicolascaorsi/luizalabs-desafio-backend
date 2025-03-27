import { Customer } from "@customers/domain/customer.entity";

export abstract class CustomersRepository {
    abstract create(customer: Customer): Promise<Customer>
}