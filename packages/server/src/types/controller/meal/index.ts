import { IsNotEmpty, IsDateString, IsInt, IsOptional } from 'class-validator';

import { DateType, IdType } from '../../table';
import { MealType } from '../../entity';
import { ResponseEntityType } from '../../common';

export class MealPostRequest {
  @IsOptional()
  @IsInt()
  IdMeal: IdType;

  @IsNotEmpty()
  @IsDateString()
  dateTime: DateType = new Date().toISOString();

  @IsNotEmpty()
  @IsInt()
  IdMealCategory: IdType = null;
}

export type MealPostResponse = ResponseEntityType<MealType>;
