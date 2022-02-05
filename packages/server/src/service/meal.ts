import { CurrentUserType, MealType } from '../types/entity';
import { MealTable } from '../types/table';
import { push } from '../utility/mysql';
import { detailById as detailByIdMealCategory } from './meal-category';

// Create a new 'MealType' for the User.
export const create = (
  user: CurrentUserType,
  data: Pick<MealTable, 'IdMealCategory' | 'dateTime'>,
): Promise<MealType> =>
  new Promise((resolve, reject) => {
    const { IdUser } = user;
    const { IdMealCategory, dateTime } = data;
    const meal = {
      ...new MealTable(),
      IdUser,
      IdMealCategory,
      dateTime: dateTime ? new Date(dateTime) : null,
    };
    // load 'MealCategory' detail for the User.
    detailByIdMealCategory(user, { IdMealCategory }).then(
      (category) =>
        // add 'Meal' for the User.
        push<Omit<MealTable, 'IdMeal'>>(`INSERT INTO Meal SET ?`, meal).then(
          ([IdMeal]) => resolve({ IdMeal, dateTime, category }),
          reject,
        ),
      reject,
    );
  });
