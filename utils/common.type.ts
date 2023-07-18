export type TResponse<T = any> = {
  status: number;
  data?: T;
  message: string | null | any;
};
