import type { ApiError } from "./types";

export class KanError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number,
    public issues: Array<{ message: string }> = []
  ) {
    super(message);
    Object.setPrototypeOf(this, KanError.prototype);
  }
}

export class BadRequestError extends KanError {
  constructor(apiError: ApiError) {
    super(apiError.message, apiError.code, 400, apiError.issues);
    this.name = "BadRequestError";
  }
}

export class UnauthorizedError extends KanError {
  constructor(apiError: ApiError) {
    super(apiError.message, apiError.code, 401, apiError.issues);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends KanError {
  constructor(apiError: ApiError) {
    super(apiError.message, apiError.code, 403, apiError.issues);
    this.name = "ForbiddenError";
  }
}

export class NotFoundError extends KanError {
  constructor(apiError: ApiError) {
    super(apiError.message, apiError.code, 404, apiError.issues);
    this.name = "NotFoundError";
  }
}

export class InternalServerError extends KanError {
  constructor(apiError: ApiError) {
    super(apiError.message, apiError.code, 500, apiError.issues);
    this.name = "InternalServerError";
  }
}

export function buildError(statusCode: number, apiError: ApiError): KanError {
  switch (statusCode) {
    case 400:
      return new BadRequestError(apiError);
    case 401:
      return new UnauthorizedError(apiError);
    case 403:
      return new ForbiddenError(apiError);
    case 404:
      return new NotFoundError(apiError);
    case 500:
      return new InternalServerError(apiError);
    default:
      return new KanError(apiError.message, apiError.code, statusCode, apiError.issues);
  }
}
