import { Action } from 'store/types';
import { eActions } from 'store/const';
import { BusyStateType, BUSY_DEFAULT, BusyActionType } from 'store/busy/types';
import { BusyActionAddType, BusyActionRemoveType } from 'store/busy/actions';

const reducer = (
  busy: BusyStateType = BUSY_DEFAULT,
  action: Action & BusyActionType
): BusyStateType => {
  switch (action.type) {
    case eActions.BUSY_ADD: {
      const { key } = action as BusyActionAddType;
      if (busy.indexOf(key) >= 0) {
        // not allowing duplicates.
        return [...busy];
      }
      return [...busy, key];
    }
    case eActions.BUSY_REMOVE: {
      const { key } = action as BusyActionRemoveType;
      const index = busy.indexOf(key);
      if (index >= 0) {
        // removing key if exists.
        const new_busy = [...busy];
        new_busy.splice(index, 1);
        return new_busy;
      }
      return [...busy];
    }
    default: {
      return [...busy];
    }
  }
};

export default reducer;
