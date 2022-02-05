import {
  UserPostRequest,
  UserPostResponse,
  UserAuthPostRequest,
  UserAuthPostResponse,
  UserGetResponse,
} from '@health-journal/server';
import service from 'services/index';

export const signUp = (data: UserPostRequest): Promise<UserPostResponse> =>
  service({
    url: '/user',
    method: 'POST',
    data,
  });

export const signIn = (
  data: UserAuthPostRequest
): Promise<UserAuthPostResponse> =>
  service({
    url: '/user/auth',
    method: 'POST',
    data,
  });

export const profile = (authorization = ''): Promise<UserGetResponse> =>
  service({
    url: '/user',
    method: 'GET',
    headers: {
      authorization,
    },
  });
