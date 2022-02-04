import {
  JsonController,
  Post,
  Body,
  Authorized,
  CurrentUser,
  Get,
  QueryParams,
  Delete,
  Put,
} from 'routing-controllers';

import {
  MealCategoryPostRequest,
  MealCategoryPostResponse,
  MealCategoryGetResponse,
  MealCategoryGetRequest,
  MealCategoryDeleteRequest,
  MealCategoryPutRequest,
  MealCategoryPutResponse,
} from '../../types/controller/meal/category';
import { CurrentUserType } from '../../types/entity';
import { ResponseType } from '../../types/common';
import { create, list, remove, update } from '../../service/meal-category';

@JsonController('/meal/category')
export class UsersController {
  // Delete 'MealCategory' for the User.
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

  // Get list of 'MealCategory' of the User.
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

  // Update a 'MealCategory' for the User.
  @Put('/')
  @Authorized()
  update(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: MealCategoryPutRequest,
  ): Promise<MealCategoryPutResponse> {
    return new Promise((resolve, reject) => {
      update(user, data).then(
        (mealCategory) =>
          resolve({
            entity: mealCategory,
            message: 'Meal category updated successfully.',
          }),
        reject,
      );
    });
  }

  // Create new 'MealCategory' for the User.
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
