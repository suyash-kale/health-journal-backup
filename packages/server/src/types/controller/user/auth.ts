import { IsPhoneNumber, IsNotEmpty, IsString, Length } from 'class-validator';

import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  MOBILE_COUNTRY,
} from '../../../const/user';
import { ResponseEntityType } from '../../common';
import { UserAuthType } from '../../entity';

export class UserAuthPostRequest {
  @IsNotEmpty()
  @IsPhoneNumber(MOBILE_COUNTRY)
  mobile = '';

  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  password = '';
}
export type UserAuthPostResponse = ResponseEntityType<UserAuthType>;
