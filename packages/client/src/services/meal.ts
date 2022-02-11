import {
  MealPostRequest,
  MealPostResponse,
  MealDishPostRequest,
  MealDishPostResponse,
} from '@health-journal/server';
import service from 'services/index';

export const add = (data: MealPostRequest): Promise<MealPostResponse> =>
  service({
    url: `/meal`,
    method: 'POST',
    data,
  });

export const addDish = (
  data: MealDishPostRequest
): Promise<MealDishPostResponse> =>
  service({
    url: `/meal/dish`,
    method: 'POST',
    data,
  });
