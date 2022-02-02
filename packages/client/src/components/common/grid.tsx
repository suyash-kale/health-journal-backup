import React, { FC } from 'react';
import MaterialGrid, { GridProps } from '@mui/material/Grid';

const Grid: FC<GridProps> = props => (
  <MaterialGrid item rowSpacing={0} columnSpacing={2} {...props}></MaterialGrid>
);

export default Grid;
