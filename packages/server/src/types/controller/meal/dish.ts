import {
  IsNotEmpty,
  ValidateNested,
  IsInt,
  Length,
  IsString,
  IsOptional,
} from 'class-validator';

import { IdType } from '../../table';
import { IngredientType, MealDishType } from '../../entity';
import { ResponseEntityType } from '../../common';
import {
  TITLE_MAX_LENGTH as TITLE_MAX_LENGTH_INGREDIENT,
  TITLE_MIN_LENGTH as TITLE_MIN_LENGTH_INGREDIENT,
} from '../../../const/ingredient';

export class Ingredient {
  @IsNotEmpty()
  @IsInt()
  IdIngredientMaster: IdType;

  @IsNotEmpty()
  @Length(TITLE_MIN_LENGTH_INGREDIENT, TITLE_MAX_LENGTH_INGREDIENT)
  title: string;
}

export class MealDishPostRequest {
  @IsOptional()
  @IsString()
  title?: string = '';

  @IsNotEmpty()
  @IsInt()
  IdMeal: IdType = null;

  @IsNotEmpty()
  @IsInt()
  IdDish: IdType = null;

  @ValidateNested()
  ingredients: Array<IngredientType> = [];
}

export type MealDishPostResponse = ResponseEntityType<MealDishType>;
