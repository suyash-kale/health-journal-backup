import { CurrentUserType } from '../types/entity';
import { DishTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new 'Dish' for the User.
export const create = (
  user: CurrentUserType,
  data: Pick<DishTable, 'title'>,
): Promise<DishTable> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { title } = data;
    // check if 'title' duplicate for the User.
    pull<Pick<DishTable, 'IdDish'>>(
      `SELECT IdDish FROM Dish WHERE title=${escape(title)} AND IdUser=${escape(
        IdUser,
      )}`,
    ).then(([arr]) => {
      if (!arr.length) {
        const dish = {
          ...new DishTable(),
          IdUser,
          title,
        };
        // not duplicate, add record.
        push<Omit<DishTable, 'IdDish'>>(`INSERT INTO Dish SET ?`, dish).then(
          ([IdDish]) => resolve({ ...dish, IdDish }),
          reject,
        );
      }
    }, reject);
  });
