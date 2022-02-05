import {
  UserTable,
  UserDetailTable,
  MealCategoryTable,
  MealTable,
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
