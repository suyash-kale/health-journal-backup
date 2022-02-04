import { IdType, UserTable, UserDetailTable } from '../types/table';
import { UserProfileType } from '../types/entity';
import { ResponseException } from '../types/http-error';
import { pull, push, escape } from '../utility/mysql';
import { compare, hash } from '../utility/bcrypt';

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
            ).then(() => resolve(IdUser), reject);
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
