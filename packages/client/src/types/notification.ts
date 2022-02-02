import { AlertColor } from '@mui/material/Alert';

export interface NotificationType {
  Id: number;
  message: string;
  severity: AlertColor;
}
