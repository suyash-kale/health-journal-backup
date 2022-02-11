import {
  UserTable,
  UserDetailTable,
  MealCategoryTable,
  MealTable,
  IngredientMasterTable,
  DishTable,
  MealDishTable,
  MealDishIngredientTable,
} from './table';

export type CurrentUserType = Pick<UserTable, 'IdUser'>;

export type UserProfileType = Pick<UserTable, 'mobile'> &
  Pick<UserDetailTable, 'first' | 'last'>;

export type UserAuthType = UserProfileType & { authorization: string };

export type MealCategoryType = Pick<
  MealCategoryTable,
  'IdMealCategory' | 'title' | 'fromTime' | 'tillTime'
>;

export type MealType = Pick<MealTable, 'IdMeal' | 'dateTime'> & {
  category: MealCategoryType;
};

export type DishType = Pick<DishTable, 'IdDish' | 'title'>;

export type IngredientType = Pick<
  IngredientMasterTable,
  'IdIngredientMaster' | 'title'
>;

export type MealDishIngredientType = Pick<
  MealDishIngredientTable,
  'IdMealDishIngredient'
> &
  Pick<IngredientMasterTable, 'IdIngredientMaster' | 'title'>;

export type MealDishType = Pick<MealDishTable, 'IdMealDish'> &
  Pick<DishTable, 'title'> & {
    ingredients: Array<MealDishIngredientType>;
  };
