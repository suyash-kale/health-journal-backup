import { MealCategoriesType } from 'types/meal-categories';
import { MealCategoriesSetType } from 'store/meal-categories/actions';

export type MealCategoriesStateType = MealCategoriesType;

export const MEAL_CATEGORIES_DEFAULT = [];

export type MealCategoriesActionType = MealCategoriesSetType;
