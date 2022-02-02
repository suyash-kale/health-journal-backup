import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import { NotificationType } from 'types/notification';
import generateRandomNumber from 'utility/generate-random-number';
import { add, remove } from 'store/notification/actions';

export type useNotificationReturn = [
  (
    message: NotificationType['message'],
    severity?: NotificationType['severity']
  ) => NotificationType['Id'],
  (Id: NotificationType['Id']) => void
];

const useNotification = (): useNotificationReturn => {
  const dispatch = useDispatch();

  const addNotification = useCallback(
    (
      message: NotificationType['message'],
      severity: NotificationType['severity'] = 'info'
    ): number => {
      const Id = generateRandomNumber();
      dispatch(
        add({
          Id,
          message,
          severity,
        })
      );
      return Id;
    },
    [dispatch]
  );

  const removeNotification = useCallback(
    (Id: NotificationType['Id']) => {
      dispatch(remove(Id));
    },
    [dispatch]
  );

  return [addNotification, removeNotification];
};

export default useNotification;
