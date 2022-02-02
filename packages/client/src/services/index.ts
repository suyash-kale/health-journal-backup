import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

import { RESPONSE_CODE_TYPE } from '@health-journal/server';
import { SERVICE_BASE_URL } from 'const/url';
import generateRandomNumber from 'utility/generate-random-number';
import store from 'store';
import { add } from 'store/notification/actions';

export interface ServiceProps extends AxiosRequestConfig {
  prepended?: boolean;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Promise<T> {
    cancel?: () => void;
    isCanceled: boolean;
  }
}

const service = <T>({
  prepended = true,
  headers = {},
  method = 'GET',
  ...rest
}: ServiceProps): Promise<T> => {
  let params: { [key: string]: string } = {};

  const { user } = store.getState();

  if (prepended) {
    rest.url = SERVICE_BASE_URL + rest.url;
  }

  if (
    (method.toUpperCase() === 'GET' || method.toUpperCase() === 'DELETE') &&
    rest.data
  ) {
    params = { ...params, ...rest.data };
  }
  rest.url += objectToParams(params);

  if (user && user.authorization) {
    headers.authorization = user.authorization;
  }

  const cancelTokenSource = axios.CancelToken.source();

  const request = axios({
    ...rest,
    method,
    headers,
    cancelToken: cancelTokenSource.token,
  })
    .then(res => {
      handleNotification(res);
      return res.data;
    })
    .catch(err => {
      if (request.isCanceled) {
        return { isCanceled: true };
      }
      handleNotification(err.response);
      throw err;
    });

  request.cancel = () => {
    cancelTokenSource.cancel();
    request.isCanceled = true;
  };

  return request;
};

export function objectToParams(o: { [name: string]: string }): string {
  let s = '';
  for (const k in o) {
    const v: string = o[k.toString()];
    s += s ? '&' : '?';
    s += k + '=' + encodeURIComponent(v);
  }
  return s;
}

export default service;

export function handleNotification(
  response: AxiosResponse<Record<string, string>, Record<string, unknown>>
) {
  if (response.status && response.data.message) {
    store.dispatch(
      add({
        Id: generateRandomNumber(),
        severity: RESPONSE_CODE_TYPE[response.status],
        message: response.data.message,
      })
    );
  }
}
