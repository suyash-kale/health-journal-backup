import mung from 'express-mung';

import transformValidationErrors from '../utility/transform-validation-errors';

const redact = (body: Record<string, unknown>) => {
  // updating errors body for class-validatory errors.
  if (body.name === 'BadRequestError' && Array.isArray(body.errors)) {
    body.errors = transformValidationErrors(body.errors);
  }
  // removing message from body for class-validator errors.
  if (body.name === 'BadRequestError' && body.message) {
    delete body.message;
  }
  if (body.name) {
    delete body.name;
  }
  if (body.stack) {
    delete body.stack;
  }
  return body;
};

export default mung.json(redact, { mungError: true });
