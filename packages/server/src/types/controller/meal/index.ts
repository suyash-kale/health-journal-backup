import { IsNotEmpty, IsDateString, IsInt } from 'class-validator';

import { DateType, IdType } from '../../table';
import { MealType } from '../../entity';
import { ResponseEntityType } from '../../common';

export class MealPostRequest {
  @IsNotEmpty()
  @IsInt()
  IdMealCategory: IdType = null;

  @IsNotEmpty()
  @IsDateString()
  dateTime: DateType = new Date().toISOString();
}

export type MealPostResponse = ResponseEntityType<MealType>;
