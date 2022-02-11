import React, { FC, useCallback, useState, useMemo } from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Chip from '@mui/material/Chip';

import { MealType, MealDishType } from '@health-journal/server';
import Loading from 'components/common/loading';
import Search from 'components/common/search';
import AddDish from 'components/meal/add-dish';

interface DishProps {
  meal: null | MealType;
  addMeal: () => Promise<MealType>;
  loading: boolean;
}

const Dish: FC<DishProps> = ({ meal, addMeal, ...props }) => {
  const [loading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const [search, setSearch] = useState<string>('');

  const [mealDishes, setMealDishes] = useState<Array<MealDishType>>([]);

  const rows = useMemo(
    () =>
      mealDishes.filter(m =>
        m.title.toLocaleLowerCase().includes(search.toLocaleLowerCase())
      ),
    [mealDishes, search]
  );

  const onAddDish = useCallback(() => {
    addMeal().then(() => setOpen(true));
  }, [addMeal]);

  const onDishAdded = useCallback((mealDish: MealDishType) => {
    setMealDishes(prev => [mealDish, ...prev]);
    setOpen(false);
  }, []);

  return (
    <>
      <Typography variant='h4' align='center' sx={{ mt: 4 }}>
        Dish
      </Typography>

      <AddDish
        meal={meal}
        open={open}
        onClose={() => setOpen(false)}
        onAdd={onDishAdded}
      />

      <Grid container spacing={2} justifyContent='center'>
        <Grid item md={4} sm={12}>
          <Grid
            container
            direction='row'
            justifyContent='right'
            alignItems='center'
            sx={{
              mt: 1,
              mb: 2,
            }}
          >
            <Search onSearch={text => setSearch(text)} loading={loading} />

            <Button
              loading={props.loading}
              loadingPosition='start'
              onClick={() => onAddDish()}
              variant='contained'
              startIcon={<AddIcon />}
              sx={{
                ml: 2,
              }}
            >
              Add
            </Button>
          </Grid>

          <Paper>
            <Loading loading={loading}>
              <List>
                {loading && !rows.length && (
                  <ListItem>
                    <CircularProgress size={24} sx={{ mr: 2 }} />
                    Loading.
                  </ListItem>
                )}
                {!loading && !rows.length && !search && (
                  <ListItem>No dishes.</ListItem>
                )}
                {!loading && !rows.length && search && (
                  <ListItem>No search results.</ListItem>
                )}
                {rows.map(d => (
                  <ListItem key={d.IdMealDish}>
                    <ListItemText>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        <Typography sx={{ mr: 2 }}>{d.title}</Typography>
                        {d.ingredients.map(i => (
                          <Chip
                            key={`${d.IdMealDish}-${i.IdMealDishIngredient}`}
                            variant='outlined'
                            label={i.title}
                            sx={{ mr: 1 }}
                          />
                        ))}
                      </div>
                    </ListItemText>
                  </ListItem>
                ))}
              </List>
            </Loading>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Dish;
