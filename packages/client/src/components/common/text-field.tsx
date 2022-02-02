import React, { FC } from 'react';
import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput';
import FormHelperText from '@mui/material/FormHelperText';

import generateRandomNumber from 'utility/generate-random-number';

const useStyles = makeStyles<Theme>(theme => ({
  textfield: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
}));

export type TextFieldProps = {
  errors?: Array<string>;
  busy?: boolean;
} & OutlinedInputProps;

const TextField: FC<TextFieldProps> = ({ busy = false, errors, ...props }) => {
  const classes = useStyles();

  const Id = `id-${generateRandomNumber()}`;

  const isError = !!errors?.length;

  return (
    <FormControl
      variant='outlined'
      className={classes.textfield}
      error={isError}
      disabled={busy || props.disabled}
    >
      <InputLabel
        htmlFor={Id}
        variant='outlined'
        error={isError}
        disabled={busy || props.disabled}
      >
        {props.label}
      </InputLabel>
      <OutlinedInput id={Id} {...props} />
      {errors?.length && <FormHelperText error>{errors[0]}</FormHelperText>}
    </FormControl>
  );
};

export default TextField;
