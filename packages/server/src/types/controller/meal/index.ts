import { IsNotEmpty, IsDateString } from 'class-validator';

import { DateType, IdType } from '../../table';
import { MealType } from '../../entity';
import { ResponseEntityType } from '../../common';

export class MealPostRequest {
  @IsNotEmpty()
  IdMealCategory: IdType;

  @IsNotEmpty()
  @IsDateString()
  dateTime: DateType;
}

export type MealPostResponse = ResponseEntityType<MealType>;
