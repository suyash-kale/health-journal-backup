import { RequestEntitiesType } from '../types/common';
import { CurrentUserType, DishType } from '../types/entity';
import { DishTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';
import { create as createMaster } from './dish-master';
import toCapitalCase from '../utility/to-capital-case';
import { paging } from '../utility/page';

// Create new 'Dish' for the User.
export const create = (
  user: CurrentUserType,
  data: Pick<DishTable, 'title'>,
): Promise<DishType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const title = toCapitalCase(data.title);
    // check if 'title' duplicate for the User.
    pull<Pick<DishTable, 'IdDish' | 'title'>>(
      `SELECT IdDish FROM Dish WHERE title=${escape(title)} AND IdUser=${escape(
        IdUser,
      )}`,
    ).then(([arr]) => {
      if (arr.length) {
        // dish already exists.
        resolve(arr[0]);
      } else {
        // not duplicate, add record.
        const dish = {
          ...new DishTable(),
          IdUser,
          title,
        };
        // creating master record.
        createMaster(user, dish);
        push<Omit<DishTable, 'IdDish'>>(`INSERT INTO Dish SET ?`, dish).then(
          ([IdDish]) => resolve({ IdDish, title }),
          reject,
        );
      }
    }, reject);
  });

// List of all 'Dish' for a User.
export const list = (
  user: CurrentUserType,
  data?: RequestEntitiesType<DishType>,
): Promise<Array<DishType>> =>
  new Promise((resolve, reject) => {
    let where = `WHERE IdUser=${user.IdUser}`;
    const { LIMIT, OFFSET } = paging(data);
    if (data?.search) {
      where += ` AND title LIKE '%${data.search}%'`;
    }
    pull<Pick<DishTable, 'IdDish' | 'title'>>(
      `SELECT IdDish, title FROM Dish ${where} ORDER BY title ASC LIMIT ${LIMIT} OFFSET ${OFFSET}`,
    ).then(([dishes]) => resolve(dishes), reject);
  });
