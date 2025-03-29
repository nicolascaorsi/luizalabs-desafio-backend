export type CustomerConstructorProps = {
  id?: string;
  name: string;
  email: string;
};

export class Customer {
  readonly id: string;
  readonly name: string;
  readonly email: string;

  constructor(props: CustomerConstructorProps) {
    this.id = props.id ?? crypto.randomUUID();
    this.name = props.name;
    this.email = props.email;
  }
}
