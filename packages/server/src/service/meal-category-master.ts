import { MealCategoryMasterTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new 'MealCategoryMaster'.
export const create = (data: Pick<MealCategoryMasterTable, 'title'>): void => {
  const { title } = data;
  // check if 'title' duplicate.
  pull<Pick<MealCategoryMasterTable, 'IdMealCategoryMaster'>>(
    `SELECT IdMealCategoryMaster FROM MealCategoryMaster WHERE title=${escape(
      title,
    )}`,
  ).then(([arr]) => {
    if (!arr.length) {
      // not duplicate, add record.
      push<Omit<MealCategoryMasterTable, 'IdMealCategoryMaster'>>(
        `INSERT INTO MealCategoryMaster SET ?`,
        {
          ...new MealCategoryMasterTable(),
          title,
        },
      );
    }
  });
};
