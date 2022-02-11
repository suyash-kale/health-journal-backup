import React, { FC } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Container from 'components/container';
import SignUp from 'routes/sign-up';
import SignIn from 'routes/sign-in';
import Meal from 'routes/meal/index';
import MealCategory from 'routes/meal/category';

const Routers: FC = () => {
  return (
    <HashRouter basename='/'>
      <Routes>
        <Route
          path='/meal/category'
          element={
            <Container
              title='Meal category'
              element={<MealCategory />}
              authorization
            />
          }
        />
        <Route
          path='/meal'
          element={
            <Container title='Meal journal' element={<Meal />} authorization />
          }
        />
        <Route
          path='/sign-in'
          element={
            <Container title='Sign in' element={<SignIn />} publicOnly />
          }
        />
        <Route
          path='/sign-up'
          element={
            <Container title='Sign up' element={<SignUp />} publicOnly />
          }
        />
        <Route
          path='/'
          element={
            <Container title='Meal journal' element={<Meal />} authorization />
          }
        />
      </Routes>
    </HashRouter>
  );
};

export default Routers;
