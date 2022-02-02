import {
  IsPhoneNumber,
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  MaxLength,
} from 'class-validator';

import {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  PASSWORD_MAX_LENGTH,
  MOBILE_COUNTRY,
} from '../../../const/user';
import { ResponseEntityType } from '../../common';
import { UserProfileType, UserAuthType } from '../../entity';

export type UserGetResponse = ResponseEntityType<UserProfileType>;

export class UserPostRequest {
  @IsNotEmpty()
  @IsPhoneNumber(MOBILE_COUNTRY)
  mobile = '';

  @Length(PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  password = '';

  @Length(NAME_MIN_LENGTH, NAME_MAX_LENGTH)
  @IsNotEmpty()
  @IsString()
  first = '';

  @MaxLength(NAME_MAX_LENGTH)
  @IsOptional()
  @IsString()
  last?: string = '';
}
export type UserPostResponse = ResponseEntityType<UserAuthType>;
