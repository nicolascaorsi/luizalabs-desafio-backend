import { NotFoundError } from '@errors/not-found-error';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { Product } from '@products/domain/product.entity';
import { CustomersService } from '../business/customers.service';
import { CreateFavoriteRequest } from './dto/create-favorite-request';
import { OnlyOwnerCanAccessGuard } from './only-owner-can-access.guard';

@Controller('customers/:id/favorites')
@ApiResponse({
  status: HttpStatus.NOT_FOUND,
  description: 'Quando o customer solicitado não é encontrado',
})
@UseGuards(OnlyOwnerCanAccessGuard)
export class FavoritesController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  async create(
    @Param('id') customerId: string,
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
    @Param('id') customerId: string,
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
    @Param('id') customerId: string,
    @Param('productId') productId: string,
  ): Promise<void> {
    await this.customersService.deleteFavorite(customerId, productId);
  }
}
