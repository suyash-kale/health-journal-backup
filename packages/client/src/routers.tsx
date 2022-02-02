import React, { FC } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';

import Container from 'components/container';
import SignUp from 'routes/sign-up';
import SignIn from 'routes/sign-in';
import Meal from 'routes/meal/index';
import MealType from 'routes/meal/type';

const Routers: FC = () => {
  return (
    <HashRouter basename='/'>
      <Routes>
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
          path='/meal'
          element={
            <Container title='Meal journal' element={<Meal />} authorization />
          }
        />
        <Route
          path='/meal/type'
          element={
            <Container title='Meal type' element={<MealType />} authorization />
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
