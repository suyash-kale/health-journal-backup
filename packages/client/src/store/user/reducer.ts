import { Action } from 'store/types';
import { eActions } from 'store/const';
import { UserStateType, USER_DEFAULT, UserActionType } from 'store/user/types';
import { UserActionSignInType } from 'store/user/actions';

const reducer = (
  user: UserStateType = USER_DEFAULT,
  action: Action & UserActionType
): UserStateType => {
  switch (action.type) {
    case eActions.USER_SIGN_IN: {
      return { ...(action as UserActionSignInType).user };
    }
    case eActions.USER_SIGN_OUT: {
      localStorage.removeItem('authorization');
      return null;
    }
    default: {
      return user ? { ...user } : null;
    }
  }
};

export default reducer;
