export type Response<T> = {
  data: T;
  success: boolean;
  code: string;
};

export type ResponseError = {
  code: string;
  errors?: ErrorData[];
  success: false;
};

export type ErrorData = {
  field: string;
  code: string;
};

export interface ActionResponse<T> {
  success: boolean;
  data?: T;
}