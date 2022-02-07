import React, { FC, useCallback, FormEvent, useState, useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Grid from '@mui/material/Grid';
import Button from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';

import {
  MealCategoryPostRequest,
  MealCategoryPutRequest,
} from '@health-journal/server';
import { add as addService } from 'services/meal-category';
import useForm from 'hooks/useForm';
import Transition from 'utility/transition';
import TimePicker from 'components/common/time-picker';
import Loading from 'components/common/loading';

export interface AddProps {
  row?: MealCategoryPostRequest | MealCategoryPutRequest;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const Add: FC<AddProps> = ({ open, row, onClose, onDone }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setValue, errors, validate, setErrors, { reset }] = useForm<
    MealCategoryPostRequest | MealCategoryPutRequest
  >(MealCategoryPostRequest);

  const [isUpdate, setIsUpdate] = useState<boolean>(false);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      validate()
        .then(() => {
          addService(form)
            .then(() => onDone())
            .catch(err => setErrors(err.response.data.errors))
            .finally(() => setLoading(false));
        })
        .catch(() => setLoading(false));
    },
    [validate, form, setErrors, onDone]
  );

  useEffect(() => {
    if (open) {
      setIsUpdate(!!(row as MealCategoryPutRequest)?.IdMealCategory);
      reset(row);
    }
  }, [open, row, reset]);

  return (
    <Dialog
      open={open}
      maxWidth='sm'
      TransitionComponent={Transition}
      fullWidth
    >
      <Loading loading={loading}>
        <DialogTitle>
          {isUpdate ? 'Update' : 'Add'} meal category
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
            }}
            disabled={loading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={onSubmit} noValidate>
            <Grid container>
              <Grid item sm={12}>
                <TextField
                  value={form.title}
                  onChange={e => setValue('title', e.target.value)}
                  disabled={loading}
                  error={!!errors.title}
                  helperText={errors.title}
                  label='Title'
                  placeholder='Enter title'
                  margin='dense'
                  variant='standard'
                  autoFocus
                  fullWidth
                />
              </Grid>
              <Grid item md={6} sm={12} sx={{ mb: 2 }}>
                <TimePicker
                  value={form.fromTime}
                  onPicked={time => setValue('fromTime', time)}
                  disabled={loading}
                  textField={{
                    error: !!errors.fromTime,
                    helperText: errors.fromTime,
                    label: 'Time from',
                    placeholder: 'Enter time from',
                    sx: {
                      pr: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item md={6} sm={12} sx={{ mb: 2 }}>
                <TimePicker
                  value={form.tillTime}
                  onPicked={time => setValue('tillTime', time)}
                  disabled={loading}
                  textField={{
                    error: !!errors.tillTime,
                    helperText: errors.tillTime,
                    label: 'Time till',
                    placeholder: 'Enter time till',
                    sx: {
                      pl: 1,
                    },
                  }}
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
                  disabled={loading}
                >
                  {isUpdate ? 'Update' : 'Add'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Loading>
    </Dialog>
  );
};

export default Add;
