import jsonwebtoken from 'jsonwebtoken';

import { SECRET } from '../const/jwt';

export const sign = <T extends Record<string, unknown>>(o: T): string =>
  jsonwebtoken.sign(o, SECRET);

export const verify = <T extends Record<string, unknown>>(
  token: string,
): Promise<T> =>
  new Promise((resolve, reject) => {
    jsonwebtoken.verify(token, SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded as T);
      }
    });
  });
