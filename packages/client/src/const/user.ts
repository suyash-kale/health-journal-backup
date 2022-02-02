import { UserType } from 'types/user';

export const CACHE_USER = process.env.REACT_APP_CACHE_USER
  ? (JSON.parse(process.env.REACT_APP_CACHE_USER) as UserType)
  : null;
