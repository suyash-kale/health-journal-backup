import { Action } from 'store/types';
import { eActions } from 'store/const';
import {
  MealCategoriesStateType,
  MEAL_CATEGORIES_DEFAULT,
  MealCategoriesActionType,
} from 'store/meal-categories/types';
import { MealCategoriesSetType } from 'store/meal-categories/actions';

const reducer = (
  categories: MealCategoriesStateType = MEAL_CATEGORIES_DEFAULT,
  action: Action & MealCategoriesActionType
) => {
  switch (action.type) {
    case eActions.MEAL_CATEGORY_SET: {
      const { cats } = action as MealCategoriesSetType;
      return [...cats];
    }
    default: {
      return [...categories];
    }
  }
};

export default reducer;
