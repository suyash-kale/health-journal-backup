import {
  IngredientPostRequest,
  IngredientPostResponse,
  IngredientGetRequest,
  IngredientGetResponse,
} from '@health-journal/server';
import service from 'services/index';

export const add = (
  data: IngredientPostRequest
): Promise<IngredientPostResponse> =>
  service({
    url: `/ingredient`,
    method: 'POST',
    data,
  });

export const list = (
  data?: IngredientGetRequest
): Promise<IngredientGetResponse> =>
  service({
    url: '/ingredient',
    method: 'GET',
    data,
  });
