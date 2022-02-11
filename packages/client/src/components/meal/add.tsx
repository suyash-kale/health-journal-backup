import React, { FC, useCallback, useEffect, useMemo, useState } from 'react';
import moment from 'moment';
import Dialog from '@mui/material/Dialog';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import grey from '@mui/material/colors/grey';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

import {
  MealCategoryType,
  MealType,
  MealPostRequest,
} from '@health-journal/server';
import { add as addMealService } from 'services/meal';
import useForm from 'hooks/useForm';
import useMealCategories from 'hooks/useMealCategories';
import Transition from 'utility/transition';
import Loading from 'components/common/loading';
import TimePicker from 'components/common/time-picker';
import Dish from 'components/meal/dish';

export interface AddProps {
  open: boolean;
  onClose: () => void;
}

const Add: FC<AddProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { mealCategories, categoryByTime } = useMealCategories();

  const [meal, setMeal] = useState<null | MealType>(null);

  const [_form, setForm] = useState(new MealPostRequest());

  const [form, updateValue, errors, validate, setErrors, { assign, reset }] =
    useForm<MealPostRequest>(MealPostRequest, [_form, setForm]);

  const category = useMemo(
    (): null | MealCategoryType =>
      mealCategories.find(m => m.IdMealCategory === form?.IdMealCategory) ||
      null,
    [form, mealCategories]
  );

  const onChangeCategory = useCallback(
    (cat: MealCategoryType | null) => {
      setForm(prev =>
        assign({
          ...prev,
          IdMealCategory: cat?.IdMealCategory || null,
        })
      );
    },
    [assign]
  );

  // onchange of time auto selecting category;
  const onPickedTime = useCallback(
    (time: Date) => {
      updateValue('dateTime', time);
      onChangeCategory(categoryByTime(moment(time)));
    },
    [categoryByTime, onChangeCategory, updateValue]
  );

  const addMeal = useCallback(
    (): Promise<MealType> =>
      new Promise((resolve, reject) => {
        if (meal) {
          // meal already added.
          resolve(meal);
        } else {
          // adding a new meal.
          setLoading(true);
          validate()
            .then(() => {
              addMealService(form)
                .finally(() => setLoading(false))
                .then(({ entity }) => {
                  setMeal(entity);
                  resolve(entity);
                })
                .catch(err => {
                  setErrors(err.response.data.errors);
                  reject(err);
                });
            })
            .catch(() => setLoading(false));
        }
      }),
    [validate, form, setErrors, meal]
  );

  // auto selecting category by current time;
  useEffect(() => {
    if (open) {
      // with 'open' making sure the category is updated whenever dialog opens.
      setMeal(null);
      reset();
      onChangeCategory(categoryByTime());
    }
  }, [open, categoryByTime, onChangeCategory, reset]);

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      PaperProps={{
        style: {
          backgroundColor: grey[300],
        },
      }}
      TransitionComponent={Transition}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            onClick={onClose}
            aria-label='close'
          >
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant='h6' component='div'>
            Add meal
          </Typography>
        </Toolbar>
      </AppBar>
      <Typography variant='h4' align='center' sx={{ mt: 3 }}>
        Meal
      </Typography>
      <Grid container spacing={2} justifyContent='center'>
        <Grid item md={4} sm={12} sx={{ mt: 2 }}>
          <Loading loading={loading}>
            <Paper
              sx={{
                p: 2,
              }}
            >
              <Grid container>
                <Grid item md={6} sm={12} sx={{ mb: 2 }}>
                  <TimePicker
                    value={form.dateTime}
                    onPicked={onPickedTime}
                    disabled={loading}
                    textField={{
                      error: !!errors.dateTime,
                      helperText: errors.dateTime,
                      label: 'Time',
                      placeholder: 'Select time',
                      sx: {
                        pr: 1,
                      },
                    }}
                  />
                </Grid>
                <Grid item md={6} sm={12} sx={{ mb: 2 }}>
                  <Autocomplete
                    value={category}
                    options={mealCategories}
                    getOptionLabel={o => o.title}
                    onChange={(_e, cat) => onChangeCategory(cat)}
                    disabled={loading}
                    renderInput={params => (
                      <TextField
                        {...params}
                        margin='dense'
                        variant='standard'
                        label='Meal category'
                        placeholder='Select meal category'
                        disabled={loading}
                        error={!!errors.IdMealCategory}
                        helperText={errors.IdMealCategory}
                        sx={{
                          pl: 1,
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>
            </Paper>
          </Loading>
        </Grid>
      </Grid>
      <Dish meal={meal} addMeal={addMeal} loading={loading} />
    </Dialog>
  );
};

export default Add;
