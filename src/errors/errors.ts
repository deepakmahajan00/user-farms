export class UnprocessableEntityError extends Error {}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = "Unauthorized";
  }
}
