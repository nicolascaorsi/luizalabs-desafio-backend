
import { Logger } from 'config/logger';
import { DataSource } from 'typeorm';
import { Customer } from '../../../../domain/customer.entity';
import { EmailDuplicatedError } from '../../../../domain/email-duplicated-error';
import { CustomerTypeOrm } from '../../customer.typeorm';
import { CustomersRepositoryTypeOrm } from '../../customers-repository-typeorm';
import { IntegrationTestDataSource } from './integration-test-data-source';

describe('CustomersRepositoryTypeOrm Integration Test', () => {
    let dataSource: DataSource;
    let customersRepository: CustomersRepositoryTypeOrm;
    beforeAll(async () => {
        dataSource = new IntegrationTestDataSource('test_customer_repository', globalThis.postgresConnectionUri)
        await dataSource.initialize()
        const loggerMock: Logger = {
            error: jest.fn()
        };
        customersRepository = new CustomersRepositoryTypeOrm(dataSource.getRepository(CustomerTypeOrm), loggerMock)
    });

    afterAll(async () => {
        await dataSource?.destroy();
    })

    beforeEach(async () => {
        await dataSource.synchronize(true)
    })

    describe('create', () => {
        it('should create a customer', async () => {
            const customerToInsert = new Customer({ name: 'John', email: 'john@test.com' })

            const insertedCustomer = await customersRepository.create(customerToInsert);
            const [customersInDatabase, customersCount] = await dataSource.getRepository(CustomerTypeOrm).findAndCount()

            expect(insertedCustomer).toEqual(customerToInsert);
            expect(customersCount).toBe(1);
            expect(customersInDatabase[0]).toEqual(<CustomerTypeOrm>{
                ...customerToInsert,
                createdAt: expect.any(Date),
                updatedAt: expect.any(Date),
            });
        });

        it('should throw EmailDuplicatedError when a previous customer has registered email before', async () => {
            const customerToInsert1 = new Customer({ name: 'Masters', email: 'mastodonte@test.com' })
            const customerToInsert2 = new Customer({ name: 'Claudinho', email: 'mastodonte@test.com' })

            await customersRepository.create(customerToInsert1);

            await expect(customersRepository.create(customerToInsert2)).rejects.toThrow(
                new EmailDuplicatedError(customerToInsert1.email)
            )
        });
    });
});