export class ValidationError extends Error {
  public constructor(validationErrors: any[]) {
    super(`Error while validating object: ${JSON.stringify(validationErrors)}`);
  }
}
