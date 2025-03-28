import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
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
    @Param('page') page: number,
    @Param('pageSize') pageSize: number,
  ): Promise<Customer[]> {
    return await this.customersService.findPaginated({ page, pageSize });
  }

  @Get(':id')
  async find(@Param('id') id: string): Promise<Customer | null> {
    return await this.customersService.find({ id });
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUsuarioDto: UpdateCustomerRequest,
  ): Promise<void> {
    await this.customersService.update({ id, ...updateUsuarioDto });
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<void> {
    await this.customersService.delete(id);
  }
}
