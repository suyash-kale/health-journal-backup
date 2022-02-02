import { ActionCreator, Action as ReduxAction } from 'redux';
import { ThunkAction } from 'redux-thunk';

import { eActions } from 'store/const';
import { BusyStateType } from 'store/busy/types';
import { NotificationStateType } from 'store/notification/types';
import { UserStateType } from 'store/user/types';

export type Action = ReduxAction<eActions>;

export type ThunkActionCreator<R> = ActionCreator<
  ThunkAction<R, Reducers, undefined, Action>
>;

export interface Reducers {
  busy: BusyStateType;
  notification: NotificationStateType;
  user: UserStateType;
}
