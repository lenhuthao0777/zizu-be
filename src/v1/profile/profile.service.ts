import { Injectable } from '@nestjs/common';
import { CommonApi } from 'utils/commonApi';

@Injectable()
export class ProfileService extends CommonApi {
  api = 'profile';
}
