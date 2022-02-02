import { UserTableType, UserDetailTableType, MealTypeTableType } from './table';

export type CurrentUserType = Pick<UserTableType, 'IdUser'>;

export type UserProfileType = Pick<UserTableType, 'mobile'> &
  Pick<UserDetailTableType, 'first' | 'last'>;

export type UserAuthType = UserProfileType & { authorization: string };

export type MealTypeType = Pick<
  MealTypeTableType,
  'IdMealType' | 'title' | 'fromTime' | 'tillTime'
>;
