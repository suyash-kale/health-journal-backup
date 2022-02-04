import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsDateString,
} from 'class-validator';

import { TITLE_MIN_LENGTH, TITLE_MAX_LENGTH } from '../../../const/meal-type';
import { DateType, IdType } from '../../table';
import { MealCategoryType } from '../../entity';
import {
  ResponseEntityType,
  ResponseEntitiesType,
  RequestEntitiesType,
} from '../../common';

export type MealCategoryDeleteRequest = Pick<
  MealCategoryType,
  'IdMealCategory'
>;

export type MealCategoryGetRequest = RequestEntitiesType<MealCategoryType>;

export type MealCategoryGetResponse = ResponseEntitiesType<MealCategoryType>;

export class MealCategoryPostRequest {
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

export type MealCategoryPostResponse = ResponseEntityType<MealCategoryType>;

export class MealCategoryPutRequest extends MealCategoryPostRequest {
  @IsNotEmpty()
  IdMealCategory: IdType;
}

export type MealCategoryPutResponse = ResponseEntityType<MealCategoryType>;
