import { MealDishType } from '../types/entity';
import { MealDishTable, DishTable } from '../types/table';
import { pull, push, escape } from '../utility/mysql';
import { ResponseException } from '../types/http-error';

// Create new 'MealDishType' for the User.
export const create = (
  data: Pick<MealDishTable, 'IdMeal' | 'IdDish'>,
): Promise<Omit<MealDishType, 'ingredients'>> =>
  new Promise((resolve, reject) => {
    const { IdMeal, IdDish } = data;
    // check if duplicate for the User.
    pull<Pick<MealDishTable, 'IdMealDish'> & Pick<DishTable, 'title'>>(
      `SELECT
      IdMealDish, title
      FROM MealDish
      INNER JOIN Dish
      ON MealDish.IdDish=Dish.IdDish
      WHERE
        MealDish.IdMeal=${escape(IdMeal)} AND
        MealDish.IdDish=${escape(IdDish)}`,
    ).then(([arr]) => {
      if (arr.length) {
        const message = 'Dish already added in the meal.';
        reject(
          new ResponseException('warning', message, { IdDish: [message] }),
        );
      } else {
        const mealDish = {
          ...new MealDishTable(),
          IdMeal,
          IdDish,
        };
        push<Omit<MealDishTable, 'IdMealDish'>>(
          `INSERT INTO MealDish SET ?`,
          mealDish,
        ).then(
          ([IdMealDish]) => detailById({ IdMealDish }).then(resolve, reject),
          reject,
        );
      }
    }, reject);
  });

// List of 'MealDishType' for the User.
export const detailById = (
  data: Pick<MealDishTable, 'IdMealDish'>,
): Promise<Omit<MealDishType, 'ingredients'>> =>
  new Promise((resolve, reject) => {
    const { IdMealDish } = data;
    pull<Pick<MealDishTable, 'IdMealDish'> & Pick<DishTable, 'title'>>(
      `SELECT
      IdMealDish, title
      FROM MealDish
      INNER JOIN Dish
      ON MealDish.IdDish=Dish.IdDish
      WHERE
        MealDish.IdMealDish=${escape(IdMealDish)}`,
    ).then(([, mealDish]) => {
      if (mealDish) {
        resolve(mealDish);
      } else {
        reject(
          new ResponseException('warning', 'Meal dish ingredient not found.'),
        );
      }
    }, reject);
  });
