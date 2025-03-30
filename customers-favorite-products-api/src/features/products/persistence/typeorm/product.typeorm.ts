import { CustomerFavoritedProductTypeOrm } from '@customers/persistence/typeorm/favorited-product.typeorm';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('products')
export class ProductTypeOrm {
  @PrimaryColumn({ type: 'uuid', primaryKeyConstraintName: 'PK_PRODUCTS' })
  id: string;

  @Column({ type: 'numeric', precision: 9, scale: 2 })
  price: number;

  @Column({ length: 2048 })
  image: string;

  @Column({ length: 500 })
  brand: string;

  @Column({ length: 500 })
  title: string;

  @Column({ type: 'numeric', precision: 3, scale: 2, nullable: true })
  reviewScore: number | undefined;

  @OneToMany(() => CustomerFavoritedProductTypeOrm, (p) => p.product)
  customerFavoritedProducts: CustomerFavoritedProductTypeOrm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
