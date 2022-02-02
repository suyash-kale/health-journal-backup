import {
  MealTypePostRequest,
  MealTypePostResponse,
  MealTypeGetResponse,
  MealTypeGetRequest,
  MealTypeDeleteRequest,
} from '@health-journal/server';
import service from 'services/index';

export const create = (
  data: MealTypePostRequest
): Promise<MealTypePostResponse> =>
  service({
    url: '/meal/type',
    method: 'POST',
    data,
  });

export const list = (data: MealTypeGetRequest): Promise<MealTypeGetResponse> =>
  service({
    url: '/meal/type',
    method: 'GET',
    data,
  });

export const remove = (data: MealTypeDeleteRequest): Promise<void> =>
  service({
    url: '/meal/type',
    method: 'DELETE',
    data,
  });
