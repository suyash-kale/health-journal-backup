import { ValidationError } from 'class-validator';

import { ErrorsType } from '../types/common';

export const transformValidationErrors = <T>(
  errs: Array<ValidationError>,
): ErrorsType<T> =>
  errs.reduce(
    (o, err) => ({
      ...o,
      [err.property]: Object.values(err.constraints || []),
    }),
    {} as ErrorsType<T>,
  );

export default transformValidationErrors;
