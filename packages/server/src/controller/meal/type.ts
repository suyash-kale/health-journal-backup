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
  MealTypePostRequest,
  MealTypePostResponse,
  MealTypeGetResponse,
  MealTypeGetRequest,
  MealTypeDeleteRequest,
} from '../../types/controller/meal/type';
import { CurrentUserType } from '../../types/entity';
import { ResponseType } from '../../types/common';
import { create, list, remove } from '../../service/meal-type';

@JsonController('/meal/type')
export class UsersController {
  // Delete meal type for the user.
  @Delete()
  @Authorized()
  remove(
    @CurrentUser({ required: true }) User: CurrentUserType,
    @QueryParams() data: MealTypeDeleteRequest,
  ): Promise<ResponseType> {
    return new Promise((resolve, reject) =>
      remove(User, data).then(
        () => resolve({ message: 'Meal type deleted successfully.' }),
        reject,
      ),
    );
  }

  // Get list of meal type of user.
  @Get()
  @Authorized()
  list(
    @CurrentUser({ required: true }) User: CurrentUserType,
    @QueryParams() data: MealTypeGetRequest,
  ): Promise<MealTypeGetResponse> {
    return new Promise((resolve, reject) => {
      list(User, data).then(
        (mealType) => resolve({ entities: mealType }),
        reject,
      );
    });
  }

  // Create new meal type.
  @Post('/')
  @Authorized()
  create(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: MealTypePostRequest,
  ): Promise<MealTypePostResponse> {
    return new Promise((resolve, reject) => {
      create(user, data).then(
        (mealType) =>
          resolve({
            entity: mealType,
            message: 'Meal type created successfully.',
          }),
        reject,
      );
    });
  }
}
