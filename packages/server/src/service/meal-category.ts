import moment from 'moment';

import { CurrentUserType, MealCategoryType } from '../types/entity';
import { RequestEntitiesType } from '../types/common';
import { MealCategoryTable } from '../types/table';
import { ResponseException } from '../types/http-error';
import { pull, push, escape, pool } from '../utility/mysql';
import { create as createMealCategoryMaster } from './meal-category-master';

// Delete a 'MealCategory' for a User.
export const remove = (
  user: CurrentUserType,
  data: Pick<MealCategoryTable, 'IdMealCategory'>,
): Promise<void> =>
  new Promise((resolve, reject) => {
    pool.query(
      `DELETE FROM MealCategory WHERE IdUser=${user.IdUser} AND IdMealCategory=${data.IdMealCategory}`,
      (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      },
    );
  });

// Create new 'MealCategory' for a User.
export const create = (
  user: CurrentUserType,
  data: Pick<MealCategoryTable, 'title' | 'fromTime' | 'tillTime'>,
): Promise<MealCategoryType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { title, fromTime, tillTime } = data;
    // check if 'title' duplicate.
    pull<Pick<MealCategoryTable, 'IdMealCategory'>>(
      `SELECT IdMealCategory FROM MealCategory WHERE IdUser=${IdUser} AND title=${escape(
        title,
      )}`,
    ).then(([arr]) => {
      if (arr.length) {
        // 'title' duplicate.
        reject(
          new ResponseException('warning', 'Meal category already added.', {
            title: ['Title already added.'],
          }),
        );
      } else {
        // 'title' not duplicate.
        // sync with master list.
        createMealCategoryMaster(data);
        const mealCategory: MealCategoryTable = {
          ...new MealCategoryTable(),
          IdUser,
          title,
          fromTime: fromTime ? new Date(fromTime) : null,
          tillTime: tillTime ? new Date(tillTime) : null,
        };
        push<Omit<MealCategoryTable, 'IdMealCategory'>>(
          `INSERT INTO MealCategory SET ?`,
          mealCategory,
        ).then(([IdMealCategory]) => {
          resolve({
            ...mealCategory,
            IdMealCategory,
          });
        }, reject);
      }
    }, reject);
  });

// List of all 'MealCategory' for a User.
export const list = (
  user: CurrentUserType,
  data?: RequestEntitiesType<MealCategoryType>,
): Promise<Array<MealCategoryType>> =>
  new Promise((resolve, reject) => {
    let where = `WHERE IdUser=${user.IdUser}`;
    if (data?.search) {
      where += ` AND title LIKE '%${data.search}%'`;
    }
    pull<
      Pick<
        MealCategoryTable,
        'IdMealCategory' | 'title' | 'fromTime' | 'tillTime'
      >
    >(
      `SELECT IdMealCategory, title, fromTime, tillTime FROM MealCategory ${where} ORDER BY fromTime ASC`,
    ).then(
      ([mealCategory]) =>
        resolve(
          mealCategory.map((o) => {
            const now = moment();
            const fromTime = moment(o.fromTime)
              .set({
                date: now.get('date'),
                month: now.get('month'),
                year: now.get('year'),
              })
              .toDate();
            const tillTime = moment(o.tillTime)
              .set({
                date: now.get('date'),
                month: now.get('month'),
                year: now.get('year'),
              })
              .toDate();
            return { ...o, fromTime, tillTime };
          }),
        ),
      reject,
    );
  });

// Update a 'MealCategory' for a User.
export const update = (
  user: CurrentUserType,
  data: Pick<
    MealCategoryTable,
    'IdMealCategory' | 'title' | 'fromTime' | 'tillTime'
  >,
): Promise<MealCategoryType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { IdMealCategory, title, fromTime, tillTime } = data;
    const mealCategory: MealCategoryTable = {
      ...new MealCategoryTable(),
      IdMealCategory,
      IdUser,
      title,
      fromTime: fromTime ? new Date(fromTime) : null,
      tillTime: tillTime ? new Date(tillTime) : null,
    };
    push<Omit<MealCategoryTable, 'IdMealCategory'>>(
      `UPDATE MealCategory SET ? WHERE IdMealCategory=${IdMealCategory} AND IdUser=${IdUser}`,
      mealCategory,
    ).then(() => resolve(mealCategory), reject);
  });

// Get MealCategory detail by Id.
export const detailById = (
  user: CurrentUserType,
  data: Pick<MealCategoryTable, 'IdMealCategory'>,
): Promise<MealCategoryType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { IdMealCategory } = data;
    pull<
      Pick<
        MealCategoryTable,
        'IdMealCategory' | 'title' | 'fromTime' | 'tillTime'
      >
    >(
      `SELECT IdMealCategory, title, fromTime, tillTime FROM MealCategory WHERE IdUser=${escape(
        IdUser,
      )} AND IdMealCategory=${escape(IdMealCategory)}`,
    ).then(([, mealCategory]) => {
      if (mealCategory) {
        resolve(mealCategory);
      } else {
        reject(new ResponseException('warning', 'Meal category not found.'));
      }
    }, reject);
  });
