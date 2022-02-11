import React, {
  FC,
  useCallback,
  useEffect,
  useState,
  FormEvent,
  useMemo,
} from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid';
import Button from '@mui/lab/LoadingButton';
import AddIcon from '@mui/icons-material/Add';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';

import {
  MealType,
  DishType,
  MealDishPostRequest,
  MealDishType,
} from '@health-journal/server';
import { addDish as addMealDishService } from 'services/meal';
import { list as listDishService, add as addDishService } from 'services/dish';
import {
  list as listIngredientService,
  add as addIngredientService,
} from 'services/ingredient';
import Transition from 'utility/transition';
import useForm from 'hooks/useForm';
import Loading from 'components/common/loading';
import AutocompleteAsync from 'components/common/autocomplete-async';

interface AddDishProps {
  meal: null | MealType;
  open: boolean;
  onClose: () => void;
  onAdd: (mealDish: MealDishType) => void;
}

const AddDish: FC<AddDishProps> = ({ meal, open, onClose, onAdd }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [_form, setForm] = useState(new MealDishPostRequest());

  const [form, updateValue, errors, validate, setErrors] =
    useForm<MealDishPostRequest>(MealDishPostRequest, [_form, setForm]);

  // creating dish.
  const dish = useMemo((): null | DishType => {
    const { IdDish, title } = form;
    if (IdDish && title) {
      return { IdDish, title };
    }
    return null;
  }, [form]);

  const onChangeDish = useCallback(
    (d: null | DishType) => {
      if (d) {
        updateValue('title', d.title);
        updateValue('IdDish', d.IdDish);
      }
    },
    [updateValue]
  );

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      validate()
        .then(() => {
          addMealDishService(form)
            .finally(() => setLoading(false))
            .then(({ entity }) => onAdd(entity))
            .catch(err => setErrors(err.response.data.errors));
        })
        .catch(() => setLoading(false));
    },
    [form, setErrors, validate, onAdd]
  );

  useEffect(() => {
    if (open) {
      setForm({
        ...new MealDishPostRequest(),
        IdMeal: meal?.IdMeal || null,
      });
    }
  }, [open, meal]);

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
            disabled={loading}
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
              <Grid item sm={12} sx={{ mb: 2 }}>
                <AutocompleteAsync
                  multiple={false}
                  label='Dish'
                  placeholder='Select dish'
                  value={dish}
                  onSelect={onChangeDish}
                  error={!!errors.IdDish}
                  helperText={errors.IdDish}
                  getOptionLabel={option => option.title}
                  getAddOption={inputValue => ({
                    IdDish: null,
                    title: `Add "${inputValue}"`,
                    inputValue,
                  })}
                  addOption={d => addDishService({ title: d.inputValue })}
                  getOptions={data => listDishService(data)}
                />
              </Grid>
              <Grid item sm={12} sx={{ mb: 2 }}>
                <AutocompleteAsync
                  multiple={true}
                  label='Ingredients'
                  placeholder='Select ingredients'
                  value={form.ingredients}
                  onSelect={arr => updateValue('ingredients', arr)}
                  getOptionLabel={option => option.title}
                  getAddOption={inputValue => ({
                    IdIngredientMaster: null,
                    title: `Add '${inputValue}'`,
                    inputValue,
                  })}
                  addOption={d => addIngredientService({ title: d.inputValue })}
                  getOptions={data => listIngredientService(data)}
                />
              </Grid>
              <Grid item sm={12} textAlign='right'>
                <Button
                  variant='outlined'
                  sx={{ mr: 1 }}
                  onClick={onClose}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  variant='contained'
                  type='submit'
                  endIcon={<AddIcon />}
                  loading={loading}
                  loadingPosition='end'
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Loading>
    </Dialog>
  );
};

export default AddDish;
