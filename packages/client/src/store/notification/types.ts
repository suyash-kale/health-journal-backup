import { NotificationType } from 'types/notification';
import {
  NotificationActionAddType,
  NotificationActionRemoveType,
} from 'store/notification/actions';

export type NotificationStateType = Array<NotificationType>;

export const NOTIFICATION_DEFAULT = [];

export type NotificationActionType =
  | NotificationActionAddType
  | NotificationActionRemoveType;
