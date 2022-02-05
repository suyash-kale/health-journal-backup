import {
  JsonController,
  Post,
  Authorized,
  CurrentUser,
  Body,
} from 'routing-controllers';

import { CurrentUserType } from '../../types/entity';
import {
  MealPostRequest,
  MealPostResponse,
} from '../../types/controller/meal/index';
import { create } from '../../service/meal';

@JsonController('/meal')
export class MealController {
  // Add 'Meal' for the User.
  @Post('/')
  @Authorized()
  create(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: MealPostRequest,
  ): Promise<MealPostResponse> {
    return new Promise((resolve, reject) => {
      create(user, data).then((entity) => resolve({ entity }), reject);
    });
  }
}
