export class CustomerNotFoundError extends Error {
  constructor() {
    super(`Usuário não encontrado`);
  }
}
