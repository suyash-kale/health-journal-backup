import { MealTypeMasterTableType } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new meal type.
export const create = (data: Pick<MealTypeMasterTableType, 'title'>): void => {
  const { title } = data;
  // check if 'title' duplicate.
  pull<Pick<MealTypeMasterTableType, 'IdMealTypeMaster'>>(
    `SELECT IdMealTypeMaster FROM MealTypeMaster WHERE title=${escape(title)}`,
  ).then(([arr]) => {
    if (!arr.length) {
      // not duplicate, add record.
      push<Omit<MealTypeMasterTableType, 'IdMealTypeMaster'>>(
        `INSERT INTO MealTypeMaster SET ?`,
        {
          title,
          createdAt: new Date(),
        },
      );
    }
  });
};
