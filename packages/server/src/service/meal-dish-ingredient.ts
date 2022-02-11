import { MealDishIngredientType } from '../types/entity';
import { MealDishIngredientTable, IngredientMasterTable } from '../types/table';
import { pull, push } from '../utility/mysql';
import { ResponseException } from '../types/http-error';

// Create new 'MealDishIngredient'.
export const create = (
  data: Pick<MealDishIngredientTable, 'IdMealDish' | 'IdIngredientMaster'>,
): Promise<MealDishIngredientType> =>
  new Promise((resolve, reject) => {
    const { IdMealDish, IdIngredientMaster } = data;
    // check if duplicate.
    pull<
      Pick<MealDishIngredientTable, 'IdMealDishIngredient'> &
        Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>
    >(
      `SELECT
      MealDishIngredient.IdMealDishIngredient, MealDishIngredient.IdIngredientMaster, IngredientMaster.title
      FROM MealDishIngredient
      INNER JOIN IngredientMaster
      ON MealDishIngredient.IdIngredientMaster=IngredientMaster.IdIngredientMaster
      WHERE
      MealDishIngredient.IdIngredientMaster=${IdIngredientMaster} AND
      MealDishIngredient.IdMealDish=${IdMealDish}`,
    ).then(([arr]) => {
      if (arr.length) {
        resolve(arr[0]);
      } else {
        const mealDishIngredient = {
          ...new MealDishIngredientTable(),
          IdMealDish,
          IdIngredientMaster,
        };
        push<Omit<MealDishIngredientTable, 'IdMealDish'>>(
          `INSERT INTO MealDishIngredient SET ?`,
          mealDishIngredient,
        ).then(
          ([IdMealDishIngredient]) =>
            detailById({ IdMealDishIngredient }).then(resolve, reject),
          reject,
        );
      }
    }, reject);
  });

// Get 'MealDishIngredient' details from 'IdMealDishIngredient'.
export const detailById = (
  data: Pick<MealDishIngredientTable, 'IdMealDishIngredient'>,
): Promise<MealDishIngredientType> =>
  new Promise((resolve, reject) => {
    const { IdMealDishIngredient } = data;
    pull<
      Pick<MealDishIngredientTable, 'IdMealDishIngredient'> &
        Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>
    >(
      `SELECT
      MealDishIngredient.IdMealDishIngredient, MealDishIngredient.IdIngredientMaster, IngredientMaster.title
      FROM MealDishIngredient
      INNER JOIN IngredientMaster
      ON MealDishIngredient.IdIngredientMaster=IngredientMaster.IdIngredientMaster
      WHERE
      MealDishIngredient.IdMealDishIngredient=${IdMealDishIngredient}`,
    ).then(([, mealDishIngredient]) => {
      if (mealDishIngredient) {
        resolve(mealDishIngredient);
      } else {
        reject(
          new ResponseException('warning', 'Meal dish ingredient not found.'),
        );
      }
    }, reject);
  });
