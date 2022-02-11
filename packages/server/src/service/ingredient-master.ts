import { RequestEntitiesType } from '../types/common';
import { IngredientType, CurrentUserType } from '../types/entity';
import { IngredientMasterTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';
import { paging } from '../utility/page';

// Create new 'IngredientMaster'.
export const create = (
  user: CurrentUserType,
  data: Pick<IngredientMasterTable, 'title'>,
): Promise<Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>> =>
  new Promise((resolve, reject) => {
    const { IdUser: createdBy } = user;
    const { title } = data;
    // check if 'title' duplicate.
    pull<Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>>(
      `SELECT IdIngredientMaster, title FROM IngredientMaster WHERE title=${escape(
        title,
      )}`,
    ).then(([arr]) => {
      if (arr.length) {
        resolve(arr[0]);
      } else {
        const ingredient = {
          ...new IngredientMasterTable(),
          title,
          createdBy,
        };
        // not duplicate, add record.
        push<Omit<IngredientMasterTable, 'IdIngredientMaster'>>(
          `INSERT INTO IngredientMaster SET ?`,
          ingredient,
        ).then(
          ([IdIngredientMaster]) => resolve({ IdIngredientMaster, title }),
          reject,
        );
      }
    }, reject);
  });

// List of all 'Ingredient' for a User.
export const list = (
  data?: RequestEntitiesType<IngredientType>,
): Promise<Array<IngredientType>> =>
  new Promise((resolve, reject) => {
    const { LIMIT, OFFSET } = paging(data);
    let where = '';
    if (data?.search) {
      where += `WHERE title LIKE '%${data.search}%'`;
    }
    pull<Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>>(
      `SELECT IdIngredientMaster, title FROM IngredientMaster ${where} ORDER BY title ASC LIMIT ${LIMIT} OFFSET ${OFFSET}`,
    ).then(([ingredients]) => resolve(ingredients), reject);
  });
