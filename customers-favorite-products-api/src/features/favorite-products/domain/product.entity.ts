export type ProductConstructorProps = {
  id: string;
  price: number;
  image: string;
  brand: string;
  title: string;
  reviewScore?: number;
};

export class Product {
  id: string;
  price: number;
  image: string;
  brand: string;
  title: string;
  reviewScore: number | undefined;

  constructor(props: ProductConstructorProps) {
    this.id = props.id;
    this.price = props.price;
    this.image = props.image;
    this.brand = props.brand;
    this.title = props.title;
    this.reviewScore = props.reviewScore;
  }
}
