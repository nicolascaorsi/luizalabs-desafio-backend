import { IsDefined } from 'class-validator';

export class CreateFavoriteRequest {
  @IsDefined()
  productId: string;
}
