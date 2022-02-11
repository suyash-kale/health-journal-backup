import { CurrentUserType } from '../types/entity';
import { DishMasterTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new 'DishMaster'.
export const create = (
  user: CurrentUserType,
  data: Pick<DishMasterTable, 'title'>,
): void => {
  const { IdUser: createdBy } = user;
  const { title } = data;
  // check if 'title' duplicate.
  pull<Pick<DishMasterTable, 'IdDishMaster'>>(
    `SELECT IdDishMaster FROM DishMaster WHERE title=${escape(title)}`,
  ).then(([arr]) => {
    if (!arr.length) {
      // not duplicate, add record.
      push<Omit<DishMasterTable, 'IdDishMaster'>>(
        `INSERT INTO DishMaster SET ?`,
        {
          ...new DishMasterTable(),
          title,
          createdBy,
        },
      );
    }
  });
};
