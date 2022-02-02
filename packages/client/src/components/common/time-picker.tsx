import React, { FC, useCallback } from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MaterialTimePicker, {
  TimePickerProps as MaterialTimePickerProps,
} from '@mui/lab/TimePicker';

export type TimePickerProps = Omit<
  MaterialTimePickerProps,
  'renderInput' | 'onChange'
> & {
  textField?: TextFieldProps;
  onPicked: (d: Date) => void;
};

const TimePicker: FC<TimePickerProps> = ({
  onPicked,
  textField = {},
  ...props
}) => {
  const onChange = useCallback(
    d => {
      onPicked(d.toDate().toISOString());
    },
    [onPicked]
  );

  return (
    <MaterialTimePicker
      {...props}
      onChange={onChange}
      renderInput={params => (
        <TextField
          {...params}
          margin='dense'
          variant='standard'
          fullWidth
          {...textField}
        />
      )}
    />
  );
};

export default TimePicker;
