import {
  JsonController,
  Post,
  Body,
  Authorized,
  Get,
  CurrentUser,
  QueryParams,
} from 'routing-controllers';

import {
  IngredientGetRequest,
  IngredientGetResponse,
  IngredientPostRequest,
  IngredientPostResponse,
} from '../../types/controller/ingredient/index';
import { CurrentUserType } from '../../types/entity';
import { create, list } from '../../service/ingredient-master';

@JsonController('/ingredient')
export class IngredientController {
  // Create new 'Ingredient' for the User.
  @Post('/')
  @Authorized()
  create(
    @CurrentUser({ required: true }) user: CurrentUserType,
    @Body() data: IngredientPostRequest,
  ): Promise<IngredientPostResponse> {
    return new Promise((resolve, reject) =>
      create(user, data).then((entity) => resolve({ entity }), reject),
    );
  }

  // List of 'Ingredient' for the User.
  @Get('/')
  @Authorized()
  list(
    @QueryParams() data: IngredientGetRequest,
  ): Promise<IngredientGetResponse> {
    return new Promise((resolve, reject) =>
      list(data).then((entities) => resolve({ entities }), reject),
    );
  }
}
