import React, { FC, useCallback, useEffect, useState, FormEvent } from 'react';
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
import Button from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import moment from 'moment';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

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

export interface AddProps {
  open: boolean;
  onClose: () => void;
}

const Add: FC<AddProps> = ({ open, onClose }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const { mealCategories, categoryByTime } = useMealCategories();

  const [category, setCategory] = useState<null | MealCategoryType>(null);

  const [meal, setMeal] = useState<null | MealType>(null);

  const [_form, setForm] = useState(new MealPostRequest());

  const [form, updateValue, errors, validate, setErrors, { assign, reset }] =
    useForm<MealPostRequest>(MealPostRequest, [_form, setForm]);

  const onChangeCategory = useCallback(
    (cat: MealCategoryType | null) => {
      setCategory(cat);
      setForm(prev =>
        assign({
          ...prev,
          IdMealCategory: cat?.IdMealCategory || null,
        })
      );
    },
    [assign]
  );

  // On change of time auto selecting category;
  const onPickedTime = useCallback(
    (time: Date) => {
      updateValue('dateTime', time);
      onChangeCategory(categoryByTime(moment(time)));
    },
    [categoryByTime, onChangeCategory, updateValue]
  );

  const addMeal = useCallback(() => {
    if (!meal) {
      setLoading(true);
      validate()
        .then(() => {
          addMealService(form)
            .finally(() => setLoading(false))
            .then(({ entity }) => setMeal(entity))
            .catch(err => setErrors(err.response.data.errors));
        })
        .catch(() => setLoading(false));
    }
  }, [validate, form, setErrors, meal]);

  // auto selecting category by current time;
  useEffect(() => {
    if (open) {
      // with 'open' making sure the category is updated whenever dialog opens.
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
                        label='Category'
                        placeholder='Select category'
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

interface DishProps {
  meal: null | MealType;
  addMeal: () => void;
  loading: boolean;
}

const Dish: FC<DishProps> = ({ meal, addMeal, ...props }) => {
  const [loading] = useState<boolean>(false);

  const [open, setOpen] = useState<boolean>(false);

  const onAddDish = useCallback(() => {
    if (meal) {
      setOpen(true);
    } else {
      addMeal();
    }
  }, [meal, addMeal]);

  useEffect(() => {
    if (meal) {
      onAddDish();
    }
  }, [meal, onAddDish]);

  return (
    <>
      <Typography variant='h4' align='center' sx={{ mt: 3 }}>
        Dish
      </Typography>

      <AddDish open={open} onClose={() => setOpen(false)} />

      <Grid container spacing={2} justifyContent='center'>
        <Grid item md={4} sm={12}>
          <Loading loading={loading}>
            <Paper
              sx={{
                p: 2,
                mt: 2,
              }}
            >
              <Grid container>
                <Grid item sm={12}>
                  <Grid
                    container
                    direction='row'
                    justifyContent='right'
                    alignItems='center'
                    sx={{
                      mb: 2,
                    }}
                  >
                    <Button
                      loading={props.loading}
                      loadingPosition='start'
                      onClick={onAddDish}
                      variant='contained'
                      startIcon={<AddIcon />}
                      sx={{
                        ml: 2,
                      }}
                    >
                      Add
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Loading>
        </Grid>
      </Grid>
    </>
  );
};

interface AddDishProps {
  open: boolean;
  onClose: () => void;
}

const AddDish: FC<AddDishProps> = ({ open, onClose }) => {
  const [loading] = useState<boolean>(false);

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);
  return (
    <Dialog
      open={open}
      maxWidth='sm'
      TransitionComponent={Transition}
      fullWidth
    >
      <Loading loading={loading}>
        <DialogTitle>
          Add dish
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit} noValidate>
            <Grid container>
              <Grid item sm={12}>
                <TextField
                  // value={form.title}
                  // onChange={e => setValue('title', e.target.value)}
                  disabled={loading}
                  // error={!!errors.title}
                  // helperText={errors.title}
                  label='Title'
                  placeholder='Enter title'
                  margin='dense'
                  variant='standard'
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item sm={12}>
                <Autocomplete
                  // value={category}
                  options={[]}
                  // getOptionLabel={o => o.title}
                  // onChange={(_e, cat) => onChangeCategory(cat)}
                  disabled={loading}
                  renderInput={params => (
                    <TextField
                      {...params}
                      margin='dense'
                      variant='standard'
                      label='Category'
                      placeholder='Select category'
                      disabled={loading}
                      // error={!!errors.IdMealCategory}
                      // helperText={errors.IdMealCategory}
                      sx={{
                        pl: 1,
                      }}
                    />
                  )}
                  selectOnFocus
                  clearOnBlur
                  handleHomeEndKeys
                  freeSolo
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Loading>
    </Dialog>
  );
};

export default Add;
