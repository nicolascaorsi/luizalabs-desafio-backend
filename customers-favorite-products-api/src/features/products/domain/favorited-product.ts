import { Product, ProductConstructorProps } from './product.entity';

export type FavoritedProductConstructorProps = ProductConstructorProps & {
  customerId: string;
};

export class FavoritedProduct extends Product {
  customerId: string;

  constructor(props: FavoritedProductConstructorProps) {
    super(props);
    this.customerId = props.customerId;
  }
}
