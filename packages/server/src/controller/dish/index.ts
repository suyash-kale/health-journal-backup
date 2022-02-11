import {
  JsonController,
  Post,
  Body,
  Authorized,
  CurrentUser,
  Get,
  QueryParams,
} from 'routing-controllers';

import {
  DishPostRequest,
  DishPostResponse,
  DishGetRequest,
  DishGetResponse,
} from '../../types/controller/dish/index';
import { CurrentUserType } from '../../types/entity';
import { create, list } from '../../service/dish';

@JsonController('/dish')
export class DishController {
  // Create new 'Dish' for the User.
  @Post('/')
  @Authorized()
  create(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: DishPostRequest,
  ): Promise<DishPostResponse> {
    return new Promise((resolve, reject) =>
      create(user, data).then((entity) => resolve({ entity }), reject),
    );
  }

  // List of 'Dish' for the User.
  @Get('/')
  @Authorized()
  list(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @QueryParams() data: DishGetRequest,
  ): Promise<DishGetResponse> {
    return new Promise((resolve, reject) =>
      list(user, data).then((entities) => resolve({ entities }), reject),
    );
  }
}
