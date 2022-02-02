import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { Reducers } from 'store/types';
import combineReducers from 'store/combine-reducers';

const store = createStore(combineReducers, compose(applyMiddleware(thunk)));

export const getState = (): Reducers => store.getState();

export default store;
