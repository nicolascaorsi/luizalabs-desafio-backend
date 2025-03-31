import { Public } from '@auth/api/decorators/public.decorator';
import { CustomerNotFoundError } from '@customers/domain/customer-not-found-error';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiResponse } from '@nestjs/swagger';
import { CustomersService } from '../business/customers.service';
import { Customer } from '../domain/customer.entity';
import { CreateCustomerRequest } from './dto/create-customer-request';
import { UpdateCustomerRequest } from './dto/update-customer-request';
import { OnlyOwnerCanAccessGuard } from './only-owner-can-access.guard';

@Controller('customers')
@UseGuards(OnlyOwnerCanAccessGuard)
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Public()
  @Post()
  async create(
    @Body() createCustomerRequest: CreateCustomerRequest,
  ): Promise<Customer> {
    return await this.customersService.create(createCustomerRequest);
  }

  @Get()
  @ApiQuery({ name: 'page', default: 1, type: Number })
  @ApiQuery({ name: 'pageSize', default: 10, type: Number })
  async findPaginated(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Customer[]> {
    return await this.customersService.findPaginated({ page, pageSize });
  }

  @Get(':id')
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quando o customer solicitado não é encontrado',
  })
  async find(@Param('id') id: string): Promise<Customer | null> {
    const result = await this.customersService.find({ id });
    if (result) return result;
    throw new NotFoundException();
  }

  @Patch(':id')
  @HttpCode(204)
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Quando o customer solicitado não é encontrado',
  })
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
