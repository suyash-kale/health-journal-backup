import { DishMasterTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new 'DishMasterTable'.
export const create = (data: Pick<DishMasterTable, 'title'>): void => {
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
        },
      );
    }
  });
};
