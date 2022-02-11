import {
  DishPostRequest,
  DishPostResponse,
  DishGetRequest,
  DishGetResponse,
} from '@health-journal/server';
import service from 'services/index';

export const add = (data: DishPostRequest): Promise<DishPostResponse> =>
  service({
    url: `/dish`,
    method: 'POST',
    data,
  });

export const list = (data?: DishGetRequest): Promise<DishGetResponse> =>
  service({
    url: '/dish',
    method: 'GET',
    data,
  });
