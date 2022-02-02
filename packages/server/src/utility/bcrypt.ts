import bcrypt from 'bcryptjs';

import { SALT_LENGTH } from '../const/bcrypt';

export const hash = (password: string): Promise<string> =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(SALT_LENGTH).then((salt) => {
      bcrypt.hash(password, salt).then(resolve, reject);
    }, reject);
  });

export const compare = (password: string, hashed: string): Promise<void> =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hashed).then((bool) => {
      if (bool) {
        resolve();
      } else {
        reject(new Error('Incorrect value.'));
      }
    }, reject);
  });
