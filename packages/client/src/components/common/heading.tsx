import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import Typography from '@mui/material/Typography';

interface HeadingProps {
  large: boolean;
  Icon?: OverridableComponent<SvgIconTypeMap>;
}

const Heading: FC<HeadingProps> = ({ large = false, Icon, children }) => {
  const classes = makeStyles<Theme, HeadingProps>(theme => ({
    typography: props => ({
      fontSize: props.large
        ? theme.typography.h3.fontSize
        : theme.typography.h4.fontSize,
      marginBottom: theme.spacing(props.large ? 3 : 2),
      textAlign: props.large ? 'center' : 'left',
    }),
    icon: props => ({
      fontSize: props.large
        ? theme.typography.h3.fontSize
        : theme.typography.h4.fontSize,
      marginRight: theme.spacing(1),
      marginBottom: props.large ? '-12px' : '-8px',
    }),
  }))({ large });

  return (
    <Typography variant={large ? 'h4' : 'h6'} className={classes.typography}>
      {Icon && <Icon className={classes.icon} />}
      {children}
    </Typography>
  );
};

export default Heading;
