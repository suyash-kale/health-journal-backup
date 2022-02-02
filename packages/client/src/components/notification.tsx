import React, { FC, useCallback } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import { NotificationType } from 'types/notification';
import { Reducers } from 'store/types';
import { NotificationStateType } from 'store/notification/types';
import useNotification from 'hooks/useNotification';

const Notification: FC = () => {
  const notifications = useSelector<Reducers, NotificationStateType>(
    o => o.notification,
    shallowEqual
  );

  const [, removeNotification] = useNotification();

  const onClose = useCallback(
    (notification: NotificationType, reason?: string) => {
      if (reason === 'clickaway') {
        return;
      }
      // removing notification from store.
      removeNotification(notification.Id);
    },
    [removeNotification]
  );

  return (
    <Stack>
      {notifications.map(notification => (
        <Snackbar
          key={notification.Id}
          autoHideDuration={4000}
          onClose={(_e, reason) => onClose(notification, reason)}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open
        >
          <Alert severity={notification.severity}>{notification.message}</Alert>
        </Snackbar>
      ))}
    </Stack>
  );
};

export default Notification;
