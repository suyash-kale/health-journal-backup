import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment, { Moment } from 'moment';

import { MealCategoryType } from '@health-journal/server';
import { Reducers } from 'store/types';
import { MealCategoriesStateType } from 'store/meal-categories/types';
import { get as getCategories, GET_KEY } from 'store/meal-categories/actions';
import useBusy from 'hooks/useBusy';

type useMealCategoriesReturn = {
  mealCategories: MealCategoriesStateType;
  categoryByTime: (now?: Moment) => null | MealCategoryType;
  loading: boolean;
  load: () => void;
};

const useMealCategories = (): useMealCategoriesReturn => {
  const dispatch = useDispatch();

  const busy = useBusy();

  const mealCategories = useSelector<Reducers, MealCategoriesStateType>(
    o => o.mealCategories
  );

  const categoryByTime = useCallback(
    (now: Moment = moment()): null | MealCategoryType => {
      let category: null | MealCategoryType = null; // selected category.
      mealCategories.every((entity, i, entities) => {
        const from = moment.utc(entity.fromTime).local(); // start time of meal category.
        const till = moment.utc(entity.tillTime).local(); // end time of meal category.
        const next = entities[i + 1]; // next meal category.
        const next_from = moment.utc(next?.fromTime).local(); // next's meal category's start time.
        if (now.isBetween(from, till, 'minute', '[]') || !next) {
          // now is in between start & time of category.
          // or no next category available.
          category = entity;
          return false;
        } else if (next_from.isAfter(now)) {
          // next category's start time is greater than now.
          // which mean the next coming category won't match.
          if (
            now.diff(moment(entity.tillTime), 'minutes') <
            moment(next_from).diff(now, 'minutes')
          ) {
            // current category is closer to now.
            category = entity;
          } else {
            // next category is closer to now.
            category = entities[i + 1];
          }
          return false;
        }
        return true;
      });
      return category;
    },
    [mealCategories]
  );

  const load = useCallback(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    load();
  }, [load]);

  return { mealCategories, categoryByTime, loading: busy.has(GET_KEY), load };
};

export default useMealCategories;
