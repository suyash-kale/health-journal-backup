import { JsonController, Post, Body } from 'routing-controllers';

import {
  UserAuthPostRequest,
  UserAuthPostResponse,
} from '../../types/controller/user/auth';
import { sign } from '../../utility/jwt';
import { profileById, authByCredentials } from '../../service/user';

@JsonController('/user/auth')
export class UsersController {
  // Authenticate User.
  @Post('/')
  signIn(@Body() data: UserAuthPostRequest): Promise<UserAuthPostResponse> {
    return new Promise((resolve, reject) => {
      // authenticating new user.
      authByCredentials(data).then((IdUser) => {
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
