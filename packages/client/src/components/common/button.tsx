import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import CircularProgress from '@mui/material/CircularProgress';
import MaterialButton, {
  ButtonProps as MaterialButtonProps,
} from '@mui/material/Button';

const useStyles = makeStyles<Theme>(theme => ({
  button: {
    float: 'right',
    marginLeft: theme.spacing(2),
  },
}));

export type ButtonProps = {
  busy?: boolean;
} & MaterialButtonProps;

const Button: FC<ButtonProps> = ({ busy = false, ...props }) => {
  const classes = useStyles();

  return (
    <MaterialButton
      variant='contained'
      color='primary'
      size='large'
      className={classes.button}
      startIcon={
        busy ? <CircularProgress color='inherit' size={24} /> : props.startIcon
      }
      disabled={busy || props.disabled}
      {...props}
    />
  );
};

export default Button;
