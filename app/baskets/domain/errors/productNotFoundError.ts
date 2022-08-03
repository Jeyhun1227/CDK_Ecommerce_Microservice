export class ProductNotFoundError extends Error {
  public constructor(id: string) {
    super(`Product with id: "${id}" not found`);
  }
}
