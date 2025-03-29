import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { CreateDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';
import { ProductTypeOrm } from './product.typeorm';

@Entity('customers_favorited_products')
export class CustomerFavoritedProductTypeOrm {
  @PrimaryColumn()
  customerId: string;

  @ManyToOne(() => CustomerTypeOrm)
  customer: CustomerTypeOrm;

  @PrimaryColumn()
  productId: string;

  @ManyToOne(() => ProductTypeOrm)
  product: ProductTypeOrm;

  @CreateDateColumn()
  createdAt: Date;
}
