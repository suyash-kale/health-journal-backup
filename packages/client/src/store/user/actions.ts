import { Action } from 'store/types';
import { eActions } from 'store/const';
import { UserType } from 'types/user';

export interface UserActionSignInType extends Action {
  user: UserType;
}
export const signIn = (user: UserType): UserActionSignInType => ({
  type: eActions.USER_SIGN_IN,
  user,
});

export type UserActionSignOutType = Action;
export const signOut = (): UserActionSignOutType => ({
  type: eActions.USER_SIGN_OUT,
});
