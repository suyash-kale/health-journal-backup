import { IdType, UserTableType, UserDetailTableType } from '../types/table';
import { UserProfileType } from '../types/entity';
import { ResponseException } from '../types/http-error';
import { pull, push, escape } from '../utility/mysql';
import { compare, hash } from '../utility/bcrypt';

// Get 'IdUser' from 'mobile'.
export const IdByMobile = ({
  mobile,
}: Pick<UserTableType, 'mobile'>): Promise<IdType> =>
  new Promise((resolve, reject) => {
    pull<UserTableType>(
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
  data: Pick<UserTableType, 'mobile' | 'password'> &
    Pick<UserDetailTableType, 'first' | 'last'>,
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
          push<Omit<UserTableType, 'IdUser'>>(`INSERT INTO User SET ?`, {
            mobile,
            password,
            createdAt: new Date(),
            updatedAt: new Date(),
          }).then(([IdUser]) => {
            // inserting into 'UserDetail' table.
            push<Omit<UserDetailTableType, 'IdUserDetail'>>(
              `INSERT INTO UserDetail SET ?`,
              {
                IdUser,
                first,
                last,
                createdAt: new Date(),
                updatedAt: new Date(),
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
}: Pick<UserTableType, 'IdUser'>): Promise<UserProfileType> => {
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
}: Pick<UserTableType, 'mobile' | 'password'>): Promise<IdType> => {
  return new Promise((resolve, reject) => {
    pull<Pick<UserTableType, 'IdUser' | 'password'>>(
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
