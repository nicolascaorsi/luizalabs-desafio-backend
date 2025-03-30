import { NotFoundError } from '@errors/not-found-error';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { Product } from '@products/domain/product.entity';
import { CustomersService } from '../business/customers.service';
import { CreateFavoriteRequest } from './dto/create-favorite-request';

@Controller('customers/:customerId/favorites')
export class FavoritesController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Param('customerId') customerId: string,
    @Body() request: CreateFavoriteRequest,
  ): Promise<Product> {
    try {
      return await this.customersService.addFavorite(
        customerId,
        request.productId,
      );
    } catch (e) {
      if (e instanceof NotFoundError) {
        throw new NotFoundException();
      }
      throw e;
    }
  }

  @Get()
  async findPaginated(
    @Param('customerId') customerId: string,
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 10,
  ): Promise<Product[]> {
    return await this.customersService.findFavoritesPaginated(customerId, {
      page,
      pageSize,
    });
  }

  @Delete(':productId')
  @HttpCode(204)
  async delete(
    @Param('customerId') customerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.customersService.deleteFavorite(customerId, productId);
  }
}
