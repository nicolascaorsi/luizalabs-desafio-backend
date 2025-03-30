import { CustomerTypeOrm } from '@customers/persistence/typeorm/customer.typeorm';
import { ProductTypeOrm } from '@products/persistence/typeorm/product.typeorm';
import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

export const PK_CUSTOMERS_FAVORITES = 'PK_CUSTOMERS_FAVORITES';
@Entity('customers_favorites')
export class CustomerFavoritedProductTypeOrm {
  @PrimaryColumn('uuid', { primaryKeyConstraintName: PK_CUSTOMERS_FAVORITES })
  customerId: string;

  @ManyToOne(() => CustomerTypeOrm)
  @JoinColumn({
    foreignKeyConstraintName: 'PK_CUSTOMERS_FAVORITES_CUSTOMER',
  })
  customer: CustomerTypeOrm;

  @PrimaryColumn('uuid', { primaryKeyConstraintName: PK_CUSTOMERS_FAVORITES })
  productId: string;

  @ManyToOne(() => ProductTypeOrm)
  @JoinColumn({
    foreignKeyConstraintName: 'PK_CUSTOMERS_FAVORITES_PRODUCT',
  })
  product: ProductTypeOrm;

  @CreateDateColumn()
  createdAt: Date;
}
