import { JsonController, Post, Authorized, Body } from 'routing-controllers';

import { MealDishIngredientType } from '../../types/entity';
import {
  MealDishPostRequest,
  MealDishPostResponse,
} from '../../types/controller/meal/dish';
import { create as createMealDish } from '../../service/meal-dish';
import { create as createMealDishIngredient } from '../../service/meal-dish-ingredient';

@JsonController('/meal/dish')
export class MealDishController {
  // Add 'MealDish' for the User.
  @Post('/')
  @Authorized()
  create(@Body() data: MealDishPostRequest): Promise<MealDishPostResponse> {
    return new Promise((resolve, reject) => {
      const { IdMeal, IdDish } = data;
      // creating dish.
      createMealDish({ IdMeal, IdDish }).then((mealDish) => {
        // once dish is created, adding dish's ingredient.
        const pArr: Array<Promise<MealDishIngredientType>> = [];
        for (const ingredient of data.ingredients) {
          const { IdIngredientMaster } = ingredient;
          const { IdMealDish } = mealDish;
          pArr.push(
            createMealDishIngredient({ IdMealDish, IdIngredientMaster }),
          );
        }
        Promise.all(pArr).then((ingredients) => {
          resolve({
            entity: {
              ...mealDish,
              ingredients,
            },
          });
        }, reject);
      }, reject);
    });
  }
}
