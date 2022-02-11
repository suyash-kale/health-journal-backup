import { IsNotEmpty, IsString, Length } from 'class-validator';

import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from '../../../const/ingredient';
import { IngredientType } from '../../entity';
import {
  ResponseEntityType,
  ResponseEntitiesType,
  RequestEntitiesType,
} from '../../common';

export type IngredientGetRequest = RequestEntitiesType<IngredientType>;

export type IngredientGetResponse = ResponseEntitiesType<IngredientType>;

export class IngredientPostRequest {
  @IsNotEmpty()
  @IsString()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title = '';
}

export type IngredientPostResponse = ResponseEntityType<IngredientType>;
