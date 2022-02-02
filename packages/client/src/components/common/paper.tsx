import React, { FC } from 'react';
import { Theme } from '@mui/material/styles';
import { makeStyles } from '@mui/styles';
import Box, { BoxProps } from '@mui/material/Box';
import MaterialPaper, {
  PaperProps as MaterialPaperProps,
} from '@mui/material/Paper';
import LinearProgress from '@mui/material/LinearProgress';

const useStyles = makeStyles<Theme>(theme => ({
  box: {
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

export type PaperProps = {
  busy?: boolean;
  box?: BoxProps;
} & MaterialPaperProps;

const Paper: FC<PaperProps> = ({ busy = false, box, children, ...props }) => {
  const classes = useStyles();

  return (
    <MaterialPaper {...props}>
      <Box p={2} mb={2} className={classes.box} {...box}>
        <>
          {busy && <LinearProgress className={classes.progress} />}
          {children}
        </>
      </Box>
    </MaterialPaper>
  );
};

export default Paper;
