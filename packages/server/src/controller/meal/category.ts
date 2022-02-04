import {
  JsonController,
  Post,
  Body,
  Authorized,
  CurrentUser,
  Get,
  QueryParams,
  Delete,
} from 'routing-controllers';

import {
  MealCategoryPostRequest,
  MealCategoryPostResponse,
  MealCategoryGetResponse,
  MealCategoryGetRequest,
  MealCategoryDeleteRequest,
} from '../../types/controller/meal/category';
import { CurrentUserType } from '../../types/entity';
import { ResponseType } from '../../types/common';
import { create, list, remove } from '../../service/meal-category';

@JsonController('/meal/category')
export class UsersController {
  // Delete 'MealCategory' for the user.
  @Delete()
  @Authorized()
  remove(
    @CurrentUser({ required: true }) User: CurrentUserType,
    @QueryParams() data: MealCategoryDeleteRequest,
  ): Promise<ResponseType> {
    return new Promise((resolve, reject) =>
      remove(User, data).then(
        () => resolve({ message: 'Meal category deleted successfully.' }),
        reject,
      ),
    );
  }

  // Get list of 'MealCategory' of user.
  @Get()
  @Authorized()
  list(
    @CurrentUser({ required: true }) User: CurrentUserType,
    @QueryParams() data: MealCategoryGetRequest,
  ): Promise<MealCategoryGetResponse> {
    return new Promise((resolve, reject) => {
      list(User, data).then(
        (mealCategory) => resolve({ entities: mealCategory }),
        reject,
      );
    });
  }

  // Create new 'MealCategory'.
  @Post('/')
  @Authorized()
  create(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: MealCategoryPostRequest,
  ): Promise<MealCategoryPostResponse> {
    return new Promise((resolve, reject) => {
      create(user, data).then(
        (mealCategory) =>
          resolve({
            entity: mealCategory,
            message: 'Meal category created successfully.',
          }),
        reject,
      );
    });
  }
}
