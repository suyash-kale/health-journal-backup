import React, { FC, useCallback, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import LoginIcon from '@mui/icons-material/Login';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { UserAuthPostRequest } from '@health-journal/server';
import { signIn as signInService } from 'services/user';
import { signIn as signInAction } from 'store/user/actions';
import useForm from 'hooks/useForm';
import Loading from 'components/common/loading';
import Password from 'components/common/password';

const SignIn: FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [form, setValue, errors, validate, setErrors] =
    useForm(UserAuthPostRequest);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      validate()
        .then(() => {
          signInService(form)
            .then(({ entity }) => {
              dispatch(signInAction(entity));
              navigate('/');
            })
            .catch(err => setErrors(err.response.data.errors))
            .finally(() => setLoading(false));
        })
        .catch(() => '')
        .finally(() => setLoading(false));
    },
    [validate, form, dispatch, navigate, setErrors]
  );

  return (
    <Grid item md={3} sm={12}>
      <Loading loading={loading}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant='h3' align='center' sx={{ mb: 3 }}>
            <LoginIcon fontSize='large' sx={{ mr: 2 }} />
            Sign in
          </Typography>
          <form onSubmit={onSubmit} noValidate>
            <Grid container sm={12}>
              <Grid sm={12}>
                <TextField
                  value={form.mobile}
                  onChange={e => setValue('mobile', e.target.value)}
                  disabled={loading}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  sx={{
                    mb: 2,
                  }}
                  label='Mobile'
                  placeholder='Enter mobile number'
                  type='number'
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid sm={12}>
                <Password
                  value={form.password}
                  onChange={e => setValue('password', e.target.value)}
                  disabled={loading}
                  error={!!errors.password}
                  formHelperText={{
                    children: errors.password,
                  }}
                  formControl={{
                    sx: {
                      mb: 2,
                    },
                  }}
                  label='Password'
                  placeholder='Enter password'
                  fullWidth
                />
              </Grid>
              <Grid sm={12} textAlign='right'>
                <Button
                  type='submit'
                  variant='contained'
                  size='large'
                  endIcon={<ArrowForwardIcon />}
                  loading={loading}
                  loadingPosition='end'
                >
                  Submit
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Loading>
      <Grid container sm={12} justifyContent='center'>
        <Button variant='text' onClick={() => navigate('/sign-up')}>
          Sign up
        </Button>
      </Grid>
    </Grid>
  );
};

export default SignIn;
