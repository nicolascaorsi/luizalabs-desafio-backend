export class ProductNotFoundError extends Error {
  constructor(productId: string) {
    super(`O produto com id '${productId}' não foi encontrado.`);
  }
}
