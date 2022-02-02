import React, { FC } from 'react';

import Grid, { GridProps } from '@mui/material/Grid';

const Container: FC<GridProps> = props => (
  <Grid container direction='row' spacing={2} {...props}></Grid>
);

export default Container;
