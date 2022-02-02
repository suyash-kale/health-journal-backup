export type OrderModeType = 'ASC' | 'DESC';

export class RequestEntitiesType<T> {
  order?: {
    column: keyof T;
    mode: OrderModeType;
  };

  size? = 10;
  page? = 1;
  search?: string;
}

export interface ResponseType {
  message?: string;
}

export interface ResponseEntitiesType<T> extends ResponseType {
  entities: Array<T>;
  count?: number;
}

export interface ResponseEntityType<T> extends ResponseType {
  entity: T;
}

export type ResponseExceptionType = 'success' | 'info' | 'warning' | 'error';

export const RESPONSE_TYPE_CODE: {
  [K in ResponseExceptionType]: number;
} = {
  success: 200,
  info: 100,
  warning: 400,
  error: 500,
};

export const RESPONSE_CODE_TYPE: { [code: number]: ResponseExceptionType } =
  Object.keys(RESPONSE_TYPE_CODE).reduce(
    (prev, type) => ({
      ...prev,
      [RESPONSE_TYPE_CODE[type as ResponseExceptionType]]: type,
    }),
    {},
  );

export type ErrorsType<T> = {
  [key in keyof T]?: Array<string>;
};
