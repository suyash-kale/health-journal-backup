import { Action } from 'routing-controllers';

import { UserTable } from '../types/table';
import { verify } from '../utility/jwt';

export const authorizationChecker = (action: Action): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const authorization = action.request?.headers?.authorization;
    verify(authorization).then(() => {
      resolve(true);
    }, reject);
  });

export const currentUserChecker = (action: Action) =>
  new Promise((resolve, reject) => {
    const authorization = action.request?.headers?.authorization;
    verify<Pick<UserTable, 'IdUser'>>(authorization).then(
      (o) => resolve(o),
      reject,
    );
  });
