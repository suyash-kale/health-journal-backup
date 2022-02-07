import { Action, ThunkActionCreator } from 'store/types';
import { eActions } from 'store/const';
import { MealCategoriesStateType } from 'store/meal-categories/types';
import { add, remove } from 'store/busy/actions';
import { list } from 'services/meal-category';

export interface MealCategoriesSetType extends Action {
  cats: MealCategoriesStateType;
}
export const set = (cats: MealCategoriesStateType) => ({
  type: eActions.MEAL_CATEGORY_SET,
  cats,
});

export const GET_KEY = 'MEAL_CATEGORIES_GET';
export const get: ThunkActionCreator<void> = () => dispatch => {
  dispatch(add(GET_KEY));
  list()
    .finally(() => dispatch(remove(GET_KEY)))
    .then(({ entities }) => dispatch(set(entities)));
};
