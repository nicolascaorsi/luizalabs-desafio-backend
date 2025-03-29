import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
} from '@nestjs/common';
import { CustomersService } from '../business/customers.service';
import { CreateFavoriteRequest } from './dto/create-favorite-request';

@Controller('customers/:customerId/favorites')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Param() customerId: string,
    @Body() request: CreateFavoriteRequest,
  ): Promise<void> {
    await this.customersService.addFavorite(customerId, request.productId);
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(
    @Param() customerId: string,
    @Body() request: CreateFavoriteRequest,
  ): Promise<void> {
    await this.customersService.deleteFavorite(customerId, request.productId);
  }
}
