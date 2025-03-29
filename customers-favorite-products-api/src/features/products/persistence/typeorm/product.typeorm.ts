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
  @PrimaryColumn()
  id: string;

  @Column()
  price: number;

  @Column()
  image: string;

  @Column()
  brand: string;

  @Column()
  title: string;

  @Column({ type: 'smallint', nullable: true })
  reviewScore: number | undefined;

  @OneToMany(() => CustomerFavoritedProductTypeOrm, (p) => p.product)
  customerFavoritedProducts: CustomerFavoritedProductTypeOrm[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
