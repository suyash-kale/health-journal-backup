import { UserType } from 'types/user';
import {
  UserActionSignInType,
  UserActionSignOutType,
} from 'store/user/actions';
import { CACHE_USER } from 'const/user';

export type UserStateType = null | UserType;

export const USER_DEFAULT = CACHE_USER;

export type UserActionType = UserActionSignInType | UserActionSignOutType;
