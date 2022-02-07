import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Reducers } from 'store/types';
import { BusyStateType } from 'store/busy/types';
import { add as addActions, remove as removeActions } from 'store/busy/actions';

type useMealCategoriesReturn = {
  busy: BusyStateType;
  add: (key: string) => void;
  remove: (key: string) => void;
  has: (key: string) => boolean;
};

const useMealCategories = (): useMealCategoriesReturn => {
  const dispatch = useDispatch();

  const busy = useSelector<Reducers, BusyStateType>(o => o.busy);

  const add = useCallback(
    (key: string) => {
      dispatch(addActions(key));
    },
    [dispatch]
  );

  const remove = useCallback(
    (key: string) => {
      dispatch(removeActions(key));
    },
    [dispatch]
  );

  const has = useCallback((key: string): boolean => busy.includes(key), [busy]);

  return {
    busy,
    add,
    remove,
    has,
  };
};

export default useMealCategories;
