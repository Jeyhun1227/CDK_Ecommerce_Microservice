export class BasketNotFoundError extends Error {
  public constructor(id: string) {
    super(`Basket with id: "${id}" not found`);
  }
}
