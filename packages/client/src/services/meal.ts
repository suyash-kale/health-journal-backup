import { MealPostRequest, MealPostResponse } from '@health-journal/server';
import service from 'services/index';

export const add = (data: MealPostRequest): Promise<MealPostResponse> =>
  service({
    url: `/meal`,
    method: 'POST',
    data,
  });
