import { combineReducers } from 'redux';

import { Reducers } from 'store/types';
import busy from 'store/busy/reducer';
import notification from 'store/notification/reducer';
import user from 'store/user/reducer';
import mealCategories from 'store/meal-categories/reducer';

export default combineReducers<Reducers>({
  busy,
  notification,
  user,
  mealCategories,
});
