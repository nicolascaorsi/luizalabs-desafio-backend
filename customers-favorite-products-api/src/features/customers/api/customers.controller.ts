import { CustomerNotFoundError } from '@customers/domain/customer-not-found-error';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  CreateCustomerRequest,
  CustomersService,
} from '../business/customers.service';
import { Customer } from '../domain/customer.entity';
import { UpdateCustomerRequest } from './dto/update-customer-request';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Body() createCustomerRequest: CreateCustomerRequest,
  ): Promise<Customer> {
    return await this.customersService.create(createCustomerRequest);
  }

  @Get()
  async findPaginated(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Customer[]> {
    return await this.customersService.findPaginated({ page, pageSize });
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Customer | null> {
    const result = await this.customersService.find({ id });
    if (result) return result;
    throw new NotFoundException();
  }

  @Patch(':id')
  @HttpCode(204)
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateCustomerRequest,
  ): Promise<void> {
    try {
      await this.customersService.update({ id, ...updateUsuarioDto });
    } catch (e) {
      if (e instanceof CustomerNotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.customersService.delete(id);
  }
}
