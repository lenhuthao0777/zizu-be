import { UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';

export type CloudinaryResponse = UploadApiResponse | UploadApiErrorResponse;

export type TResponse<T = any> = {
  status: number;
  data?: T;
  message: string | null | any;
};
