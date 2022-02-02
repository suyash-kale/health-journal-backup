import { HttpError } from 'routing-controllers';

import { ResponseExceptionType, RESPONSE_TYPE_CODE } from './common';

export class ResponseException extends HttpError {
  public errors? = {};

  constructor(
    type: ResponseExceptionType,
    message?: string,
    errors?: { [key: string]: Array<string> },
  ) {
    super(RESPONSE_TYPE_CODE[type]);
    this.name = type;
    this.message = message || '';
    this.errors = errors;
  }
}
