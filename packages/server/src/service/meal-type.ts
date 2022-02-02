import { CurrentUserType, MealTypeType } from '../types/entity';
import { RequestEntitiesType } from '../types/common';
import { MealTypeTableType } from '../types/table';
import { ResponseException } from '../types/http-error';
import { pull, push, escape, pool } from '../utility/mysql';
import { create as createMealTypeMaster } from './meal-type-master';

// Delete a meal type.
export const remove = (
  user: CurrentUserType,
  data: Pick<MealTypeType, 'IdMealType'>,
): Promise<void> =>
  new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM MealType WHERE IdUser=${user.IdUser} AND IdMealType=${data.IdMealType}`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });

// Create new meal type.
export const create = (
  user: CurrentUserType,
  data: Omit<MealTypeType, 'IdMealType'>,
): Promise<MealTypeType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { title, fromTime, tillTime } = data;
    // check if 'title' duplicate.
    pull<Pick<MealTypeTableType, 'IdMealType'>>(
      `SELECT IdMealType FROM MealType WHERE IdUser=${IdUser} AND title=${escape(
        title,
      )}`,
    ).then(([arr]) => {
      if (arr.length) {
        // 'title' duplicate.
        reject(
          new ResponseException('warning', 'Meal type already added.', {
            title: ['Title already added.'],
          }),
        );
      } else {
        // 'title' not duplicate.
        // sync with master list.
        createMealTypeMaster(data);
        const date = new Date();
        push<Omit<MealTypeTableType, 'IdMealType'>>(
          `INSERT INTO MealType SET ?`,
          {
            IdUser,
            title,
            fromTime: fromTime ? new Date(fromTime) : null,
            tillTime: tillTime ? new Date(tillTime) : null,
            createdAt: date,
            updatedAt: date,
          },
        ).then(([IdMealType]) => {
          resolve({
            ...data,
            IdMealType,
          });
        }, reject);
      }
    }, reject);
  });

export const list = (
  user: CurrentUserType,
  data?: RequestEntitiesType<MealTypeType>,
): Promise<Array<MealTypeType>> =>
  new Promise((resolve, reject) => {
    let where = '';
    if (data?.search) {
      where = ` AND title LIKE '%${data.search}%'`;
    }
    pull<
      Pick<MealTypeTableType, 'IdMealType' | 'title' | 'fromTime' | 'tillTime'>
    >(
      `SELECT IdMealType, title, fromTime, tillTime FROM MealType WHERE IdUser=${user.IdUser} ${where}`,
    ).then(([mealType]) => resolve(mealType), reject);
  });
