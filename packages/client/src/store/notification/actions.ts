import { Action } from 'store/types';
import { eActions } from 'store/const';
import { NotificationType } from 'types/notification';

export interface NotificationActionAddType extends Action {
  notification: NotificationType;
}
export const add = (
  notification: NotificationType
): NotificationActionAddType => ({
  type: eActions.NOTIFICATION_ADD,
  notification,
});

export interface NotificationActionRemoveType extends Action {
  Id: NotificationType['Id'];
}
export const remove = (
  Id: NotificationType['Id']
): NotificationActionRemoveType => ({
  type: eActions.NOTIFICATION_REMOVE,
  Id,
});
