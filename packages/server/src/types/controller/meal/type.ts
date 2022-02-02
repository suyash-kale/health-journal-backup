import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from '../../../const/meal-type';
import { DateType } from '../../table';
import { MealTypeType } from '../../entity';
import {
  ResponseEntityType,
  ResponseEntitiesType,
  RequestEntitiesType,
} from '../../common';

export type MealTypeDeleteRequest = Pick<MealTypeType, 'IdMealType'>;

export type MealTypeGetRequest = RequestEntitiesType<MealTypeType>;

export type MealTypeGetResponse = ResponseEntitiesType<MealTypeType>;

export class MealTypePostRequest {
  @IsNotEmpty()
  @IsString()
  @Length(TITLE_MIN_LENGTH, TITLE_MAX_LENGTH)
  title = '';

  @IsOptional()
  @IsDateString()
  fromTime: null | DateType = null;

  @IsOptional()
  @IsDateString()
  tillTime: null | DateType = null;
}

export type MealTypePostResponse = ResponseEntityType<MealTypeType>;
