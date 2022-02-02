import React, { FC, useState } from 'react';
import FormControl, { FormControlProps } from '@mui/material/FormControl';
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormHelperText, {
  FormHelperTextProps,
} from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';

import generateRandomNumber from 'utility/generate-random-number';

export type PasswordProps = {
  formControl?: FormControlProps;
  inputLabel?: InputLabelProps;
  formHelperText?: FormHelperTextProps;
} & OutlinedInputProps;

const Password: FC<PasswordProps> = ({
  formControl,
  inputLabel,
  formHelperText,
  ...props
}) => {
  const Id = `id-${generateRandomNumber()}`;

  const [show, setShow] = useState(false);

  return (
    <FormControl
      disabled={props.disabled}
      fullWidth
      error={props.error}
      {...formControl}
    >
      <InputLabel error={props.error} {...inputLabel} htmlFor={Id}>
        {props.label}
      </InputLabel>
      <OutlinedInput
        {...props}
        id={Id}
        type={show ? 'text' : 'password'}
        endAdornment={
          <InputAdornment position='end'>
            <IconButton
              disabled={props.disabled}
              onClick={() => setShow(b => !b)}
            >
              {show ? <VisibilityIcon /> : <VisibilityOffIcon />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error={props.error} {...formHelperText}></FormHelperText>
    </FormControl>
  );
};

export default Password;
