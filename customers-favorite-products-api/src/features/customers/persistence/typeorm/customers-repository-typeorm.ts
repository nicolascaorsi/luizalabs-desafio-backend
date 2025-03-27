import { Logger } from "@config/logger";
import { UnexpectedError } from "@config/unexpected-error";
import { Customer } from "@customers/domain/customer.entity";
import { EmailDuplicatedError } from "@customers/domain/email-duplicated-error";
import { CustomersRepository } from "@customers/persistence/customers-repository";
import { Repository } from 'typeorm';
import { CustomerTypeOrm, UQ_CUSTOMER_EMAIL } from "./customer.typeorm";

export class CustomersRepositoryTypeOrm implements CustomersRepository {
    constructor(
        private customersRepository: Repository<CustomerTypeOrm>, private readonly logger: Logger) { }

    async create(customer: Customer): Promise<Customer> {
        try {
            await this.customersRepository.insert({ ...customer })
            return customer;
        } catch (e) {
            throw await this.convertToExpectedError(e, customer);
        }
    }

    private async convertToExpectedError(e: Error, customer: Customer) {
        const message = e?.message as string | undefined;
        if (message?.includes(UQ_CUSTOMER_EMAIL)) {
            return new EmailDuplicatedError(customer.email);
        }
        await this.logger.error(e);
        return new UnexpectedError();
    }
}