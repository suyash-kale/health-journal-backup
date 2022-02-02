import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import { SvgIconTypeMap } from '@mui/material/SvgIcon';
import { OverridableComponent } from '@mui/material/OverridableComponent';

const useStyles = makeStyles<Theme>(theme => ({
  container: {
    display: 'inline-block',
    position: 'relative',
  },
  secondary: {
    position: 'absolute',
    bottom: '2px',
    right: '-6px',
  },
}));

export interface IconMergeProps {
  Primary: OverridableComponent<SvgIconTypeMap>;
  primary?: SvgIconTypeMap['props'];
  Secondary: OverridableComponent<SvgIconTypeMap>;
  secondary?: SvgIconTypeMap['props'];
}

const IconMerge: FC<IconMergeProps> = ({
  Primary,
  primary,
  Secondary,
  secondary,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Primary opacity={1} {...primary} />
      <Secondary
        className={classes.secondary}
        fontSize='small'
        opacity={1}
        {...secondary}
      />
    </div>
  );
};

export default IconMerge;
