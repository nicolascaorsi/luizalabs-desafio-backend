import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { CustomerFavoritedProductTypeOrm } from './favorited-product.typeorm';

export const UQ_CUSTOMER_EMAIL = 'UQ_CUSTOMER_EMAIL';

@Unique(UQ_CUSTOMER_EMAIL, ['email'])
@Entity('customers')
export class CustomerTypeOrm {
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'PK_CUSTOMERS' })
  id: string;

  @Column({ length: 1100 })
  name: string;

  @Column({ length: 320 })
  email: string;

  @OneToMany(() => CustomerFavoritedProductTypeOrm, (p) => p.customer)
  customerFavoritedProducts: CustomerFavoritedProductTypeOrm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
