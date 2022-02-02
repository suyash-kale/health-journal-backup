import { Action } from 'store/types';
import { eActions } from 'store/const';
import {
  NotificationStateType,
  NOTIFICATION_DEFAULT,
  NotificationActionType,
} from 'store/notification/types';
import {
  NotificationActionAddType,
  NotificationActionRemoveType,
} from 'store/notification/actions';

const reducer = (
  notifications: NotificationStateType = NOTIFICATION_DEFAULT,
  action: Action & NotificationActionType
): NotificationStateType => {
  switch (action.type) {
    case eActions.NOTIFICATION_ADD: {
      const { notification } = action as NotificationActionAddType;
      if (
        notifications.findIndex(
          o =>
            o.severity === notification.severity &&
            o.message === notification.message
        ) >= 0
      ) {
        return [...notifications];
      }
      return [...notifications, notification];
    }
    case eActions.NOTIFICATION_REMOVE: {
      const { Id } = action as NotificationActionRemoveType;
      return [...notifications].filter(o => o.Id !== Id);
    }
    default: {
      return [...notifications];
    }
  }
};

export default reducer;
