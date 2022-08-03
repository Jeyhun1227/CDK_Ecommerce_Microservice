export class OrderNotFoundError extends Error {
  public constructor(id: string) {
    super(`Order with id: "${id}" not found`);
  }
}
