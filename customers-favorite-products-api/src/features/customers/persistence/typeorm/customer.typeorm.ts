import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerFavoritedProductTypeOrm } from '../../../favorite-products/persistence/typeorm/favorited-product.typeorm';

export const UQ_CUSTOMER_EMAIL = 'UQ_CUSTOMER_EMAIL';

@Unique(UQ_CUSTOMER_EMAIL, ['email'])
@Entity('customers')
export class CustomerTypeOrm {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @OneToMany(() => CustomerFavoritedProductTypeOrm, (p) => p.customer)
  customerFavoritedProducts: CustomerFavoritedProductTypeOrm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
