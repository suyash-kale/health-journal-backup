import {
  MealCategoryPostRequest,
  MealCategoryPostResponse,
  MealCategoryGetResponse,
  MealCategoryGetRequest,
  MealCategoryDeleteRequest,
  MealCategoryPutRequest,
  MealCategoryPutResponse,
} from '@health-journal/server';
import service from 'services/index';

export const add = (
  data: MealCategoryPostRequest | MealCategoryPutRequest
): Promise<MealCategoryPostResponse | MealCategoryPutResponse> =>
  service({
    url: `/meal/category`,
    method: (data as MealCategoryPutRequest).IdMealCategory ? 'PUT' : 'POST',
    data,
  });

export const list = (
  data?: MealCategoryGetRequest
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
