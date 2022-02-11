import moment from 'moment';

import { IdType, UserTable, UserDetailTable } from '../types/table';
import { UserProfileType, MealCategoryType } from '../types/entity';
import { ResponseException } from '../types/http-error';
import { pull, push, escape } from '../utility/mysql';
import { compare, hash } from '../utility/bcrypt';
import { create as createMealCategory } from './meal-category';

// Get 'IdUser' from 'mobile'.
export const IdByMobile = ({
  mobile,
}: Pick<UserTable, 'mobile'>): Promise<IdType> =>
  new Promise((resolve, reject) => {
    pull<UserTable>(
      `SELECT IdUser from User WHERE mobile=${escape(mobile)}`,
    ).then(([, user]) => {
      if (user) {
        resolve(user.IdUser);
      } else {
        const message = 'Mobile not found.';
        reject(
          new ResponseException('warning', message, {
            mobile: [message],
          }),
        );
      }
    });
  });

// Create new User.
export const create = (
  data: Pick<UserTable, 'mobile' | 'password'> &
    Pick<UserDetailTable, 'first' | 'last'>,
): Promise<number> => {
  return new Promise((resolve, reject) => {
    const { mobile, first, last } = data;
    // checking if 'mobile' already registered.
    IdByMobile({ mobile }).then(
      () => {
        const message = 'Mobile already registered.';
        reject(
          new ResponseException('warning', message, { mobile: [message] }),
        );
      },
      () => {
        // 'mobile' not registered.
        hash(data.password).then((password) => {
          // inserting into 'User' table.
          push<Omit<UserTable, 'IdUser'>>(`INSERT INTO User SET ?`, {
            ...new UserTable(),
            mobile,
            password,
          }).then(([IdUser]) => {
            // inserting into 'UserDetail' table.
            push<Omit<UserDetailTable, 'IdUserDetail'>>(
              `INSERT INTO UserDetail SET ?`,
              {
                ...new UserDetailTable(),
                IdUser,
                first,
                last,
              },
            ).then(() => {
              // default added meal categories.
              const defaultMealCategory: Array<MealCategoryType> = [
                {
                  IdMealCategory: null,
                  title: 'Breakfast',
                  fromTime: moment()
                    .set({
                      hours: 7,
                      minutes: 0,
                    })
                    .toISOString(),
                  tillTime: moment()
                    .set({
                      hours: 11,
                      minutes: 0,
                    })
                    .toISOString(),
                },
                {
                  IdMealCategory: null,
                  title: 'Lunch',
                  fromTime: moment()
                    .set({
                      hours: 12,
                      minutes: 0,
                    })
                    .toISOString(),
                  tillTime: moment()
                    .set({
                      hours: 16,
                      minutes: 0,
                    })
                    .toISOString(),
                },
                {
                  IdMealCategory: null,
                  title: 'Dinner',
                  fromTime: moment()
                    .set({
                      hours: 19,
                      minutes: 0,
                    })
                    .toISOString(),
                  tillTime: moment()
                    .set({
                      hours: 22,
                      minutes: 0,
                    })
                    .toISOString(),
                },
                {
                  IdMealCategory: null,
                  title: 'Snacks',
                  fromTime: null,
                  tillTime: null,
                },
              ];
              const pArr: Array<Promise<unknown>> = [];
              for (const mealCategory of defaultMealCategory) {
                pArr.push(createMealCategory({ IdUser }, mealCategory));
              }
              Promise.all(pArr).finally(() => resolve(IdUser));
            }, reject);
          }, reject);
        }, reject);
      },
    );
  });
};

// Get 'UserProfile' by 'IdUser';
export const profileById = ({
  IdUser,
}: Pick<UserTable, 'IdUser'>): Promise<UserProfileType> => {
  return new Promise((resolve, reject) => {
    pull<UserProfileType>(
      `SELECT User.mobile, UserDetail.first, UserDetail.last FROM User INNER JOIN UserDetail ON User.IdUser=UserDetail.IdUser WHERE User.IdUser=${escape(
        IdUser,
      )}`,
    ).then(([, user]) => {
      if (user) {
        resolve(user);
      } else {
        reject(new ResponseException('error', 'User not found.'));
      }
    });
  });
};

// Authenticate user by their Credentials.
export const authByCredentials = ({
  mobile,
  password,
}: Pick<UserTable, 'mobile' | 'password'>): Promise<IdType> => {
  return new Promise((resolve, reject) => {
    pull<Pick<UserTable, 'IdUser' | 'password'>>(
      `SELECT IdUser, password FROM User WHERE mobile=${escape(mobile)}`,
    ).then(([, user]) => {
      if (user && user.IdUser) {
        // 'mobile' found.
        compare(password, user.password).then(
          () => {
            // correct 'password'.
            if (user.IdUser) {
              resolve(user.IdUser);
            }
          },
          () => {
            // 'password' not matched.
            const message = 'Password is incorrect.';
            reject(
              new ResponseException('warning', message, {
                password: [message],
              }),
            );
          },
        );
      } else {
        // 'mobile' not found.
        const message = 'Mobile not registered.';
        reject(
          new ResponseException('warning', message, {
            mobile: [message],
          }),
        );
      }
    }, reject);
  });
};
