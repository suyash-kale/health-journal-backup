import React, { FC } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import RestaurantIcon from '@mui/icons-material/Restaurant';

const Index: FC = () => {
  return (
    <Grid item sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <RestaurantIcon fontSize='large' sx={{ mr: 2 }} />
        Meal journal
      </Typography>
    </Grid>
  );
};

export default Index;
