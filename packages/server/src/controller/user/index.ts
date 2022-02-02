import {
  JsonController,
  Post,
  Body,
  Get,
  Authorized,
  CurrentUser,
} from 'routing-controllers';

import {
  UserPostRequest,
  UserPostResponse,
  UserGetResponse,
} from '../../types/controller/user/index';
import { CurrentUserType } from '../../types/entity';
import { sign } from '../../utility/jwt';
import { create, profileById } from '../../service/user';

@JsonController('/user')
export class UsersController {
  // Get 'UserType'.
  @Get('/')
  @Authorized()
  detail(
    @CurrentUser({ required: true }) User: CurrentUserType,
  ): Promise<UserGetResponse> {
    return new Promise((resolve, reject) => {
      profileById(User).then((user) => resolve({ entity: user }), reject);
    });
  }

  // Create new User.
  @Post('/')
  signUp(@Body() data: UserPostRequest): Promise<UserPostResponse> {
    return new Promise((resolve, reject) => {
      // creating new user.
      create(data).then((IdUser) => {
        // getting user details.
        profileById({ IdUser }).then((user) => {
          // generating jwt token.
          const authorization = sign({ IdUser });
          resolve({ entity: { ...user, authorization } });
        }, reject);
      }, reject);
    });
  }
}
