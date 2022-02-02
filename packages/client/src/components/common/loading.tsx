import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Box, { BoxProps } from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const useStyles = makeStyles<Theme>(theme => ({
  grid: {
    position: 'relative',
    overflow: 'hidden',
    borderRadius: theme.shape.borderRadius,
  },
  progress: {
    position: 'absolute',
    width: '100%',
    left: 0,
    top: 0,
  },
}));

export type LoadingProps = {
  loading?: boolean;
} & BoxProps;

const Loading: FC<LoadingProps> = ({ loading = false, children, ...props }) => {
  const classes = useStyles();

  return (
    <Box className={classes.grid} {...props}>
      {loading && <LinearProgress className={classes.progress} />}
      {children}
    </Box>
  );
};

export default Loading;
