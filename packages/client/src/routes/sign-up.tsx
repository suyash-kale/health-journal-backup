import React, { FC, useCallback, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

import { UserPostRequest } from '@health-journal/server';
import { signUp as signUpService } from 'services/user';
import { signIn as signInAction } from 'store/user/actions';
import useForm from 'hooks/useForm';
import Loading from 'components/common/loading';
import Password from 'components/common/password';

const SignUp: FC = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(false);

  const [form, setValue, errors, validate, setErrors] =
    useForm(UserPostRequest);

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);
      validate()
        .then(() => {
          signUpService(form)
            .finally(() => setLoading(false))
            .then(({ entity }) => {
              dispatch(signInAction(entity));
              navigate('/meal/category');
            })
            .catch(err => setErrors(err.response.data.errors));
        })
        .catch(() => '')
        .finally(() => setLoading(false));
    },
    [validate, form, dispatch, navigate, setErrors]
  );

  return (
    <Grid item md={4} sm={12}>
      <Loading loading={loading}>
        <Paper
          sx={{
            p: 2,
            mb: 2,
          }}
        >
          <Typography variant='h3' align='center' sx={{ mb: 3 }}>
            <AccountCircleIcon fontSize='large' sx={{ mr: 2 }} />
            Sign up
          </Typography>
          <form onSubmit={onSubmit} noValidate>
            <Grid container>
              <Grid item md={6} sm={12} sx={{ pr: 1 }}>
                <TextField
                  value={form.first}
                  onChange={e => setValue('first', e.target.value)}
                  disabled={loading}
                  error={!!errors.first}
                  helperText={errors.first}
                  sx={{
                    mb: 2,
                  }}
                  label='First name'
                  placeholder='Enter first name'
                  fullWidth
                  autoFocus
                />
              </Grid>
              <Grid item md={6} sm={12} sx={{ pl: 1 }}>
                <TextField
                  value={form.last}
                  onChange={e => setValue('last', e.target.value)}
                  disabled={loading}
                  error={!!errors.last}
                  helperText={errors.last}
                  sx={{
                    mb: 2,
                  }}
                  label='Last name'
                  placeholder='Enter last name'
                  fullWidth
                />
              </Grid>
              <Grid item sm={12}>
                <TextField
                  value={form.mobile}
                  onChange={e => setValue('mobile', e.target.value)}
                  disabled={loading}
                  error={!!errors.mobile}
                  helperText={errors.mobile}
                  sx={{
                    mb: 2,
                  }}
                  label='Mobile name'
                  placeholder='Enter mobile name'
                  fullWidth
                />
              </Grid>
              <Grid item sm={12}>
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
              <Grid item sm={12} textAlign='right'>
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
      <Grid container justifyContent='center'>
        <Button variant='text' onClick={() => navigate('/sign-in')}>
          Sign in
        </Button>
      </Grid>
    </Grid>
  );
};

export default SignUp;
