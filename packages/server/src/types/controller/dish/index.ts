import { IsNotEmpty, Length } from 'class-validator';

import { DishType } from '../../entity';
import {
  ResponseEntityType,
  RequestEntitiesType,
  ResponseEntitiesType,
} from '../../common';
import { TITLE_MAX_LENGTH, TITLE_MIN_LENGTH } from '../../../const/dish';

export class DishPostRequest {
  @IsNotEmpty()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title: string;
}

export type DishPostResponse = ResponseEntityType<DishType>;

export type DishGetRequest = RequestEntitiesType<DishType>;

export type DishGetResponse = ResponseEntitiesType<DishType>;
