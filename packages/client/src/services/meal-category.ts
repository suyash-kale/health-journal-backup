import {
  MealCategoryPostRequest,
  MealCategoryPostResponse,
  MealCategoryGetResponse,
  MealCategoryGetRequest,
  MealCategoryDeleteRequest,
} from '@health-journal/server';
import service from 'services/index';

export const create = (
  data: MealCategoryPostRequest
): Promise<MealCategoryPostResponse> =>
  service({
    url: '/meal/category',
    method: 'POST',
    data,
  });

export const list = (
  data: MealCategoryGetRequest
): Promise<MealCategoryGetResponse> =>
  service({
    url: '/meal/category',
    method: 'GET',
    data,
  });

export const remove = (data: MealCategoryDeleteRequest): Promise<void> =>
  service({
    url: '/meal/category',
    method: 'DELETE',
    data,
  });
