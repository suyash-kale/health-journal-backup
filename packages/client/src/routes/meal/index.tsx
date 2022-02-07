import React, { FC, useState } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Button from '@mui/lab/LoadingButton';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import AddIcon from '@mui/icons-material/Add';

import Search from 'components/common/search';
import Add from 'components/meal/add';

const Index: FC = () => {
  const [open, setOpen] = useState<boolean>(false);

  const [loading] = useState<boolean>(false);

  const [, setSearch] = useState<string>('');

  return (
    <Grid item sm={12}>
      <Typography variant='h3' align='center' sx={{ mb: 3 }}>
        <RestaurantIcon fontSize='large' sx={{ mr: 2 }} />
        Meal journal
      </Typography>

      <Add open={open} onClose={() => setOpen(false)} />

      <Grid
        container
        direction='row'
        justifyContent='right'
        alignItems='center'
        sx={{
          mb: 2,
        }}
      >
        <Search onSearch={text => setSearch(text)} loading={loading} />
        <Button
          variant='contained'
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            ml: 2,
          }}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default Index;
