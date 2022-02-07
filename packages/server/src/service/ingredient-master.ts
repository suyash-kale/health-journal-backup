import { IngredientMaster } from '../types/table';
import { pull, push, escape } from '../utility/mysql';

// Create new 'IngredientMaster'.
export const create = (data: Pick<IngredientMaster, 'title'>): void => {
  const { title } = data;
  // check if 'title' duplicate.
  pull<Pick<IngredientMaster, 'IdIngredientMaster'>>(
    `SELECT IdIngredientMaster FROM IngredientMaster WHERE title=${escape(
      title,
    )}`,
  ).then(([arr]) => {
    if (!arr.length) {
      // not duplicate, add record.
      push<Omit<IngredientMaster, 'IdIngredientMaster'>>(
        `INSERT INTO IngredientMaster SET ?`,
        {
          ...new IngredientMaster(),
          title,
        },
      );
    }
  });
};
