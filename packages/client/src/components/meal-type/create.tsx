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

import { MealTypePostRequest } from '@health-journal/server';
import { create as createService } from 'services/meal-type';
import useForm from 'hooks/useForm';
import TimePicker from 'components/common/time-picker';
import Loading from 'components/common/loading';

export interface CreateProps {
  row?: MealTypePostRequest;
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}

const Create: FC<CreateProps> = ({ open, row, onClose, onDone }) => {
  const [loading, setLoading] = useState<boolean>(false);

  const [form, setValue, errors, validate, setErrors, reset] =
    useForm(MealTypePostRequest);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      validate()
        .then(() => {
          createService(form)
            .then(() => onDone())
            .catch(err => setErrors(err.response.data.errors))
            .finally(() => setLoading(false));
        })
        .catch(() => '')
        .finally(() => setLoading(false));
    },
    [validate, form, setErrors, onDone]
  );

  useEffect(() => {
    if (open) {
      reset(row);
    }
  }, [open, row, reset]);

  return (
    <Dialog open={open} maxWidth='sm' fullWidth>
      <Loading loading={loading}>
        <DialogTitle>
          Create meal type
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
                <Button variant='outlined' sx={{ mr: 2 }} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant='contained' type='submit' endIcon={<AddIcon />}>
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
      </Loading>
    </Dialog>
  );
};

export default Create;
