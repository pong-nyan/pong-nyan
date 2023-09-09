import { Injectable } from '@nestjs/common';
import { UserService } from './user.service';
import { IntraId, UserInfo } from 'src/type/userType';
import { SocketId } from 'src/type/socketType';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}

  getHello(): string {
    return 'Hello World!';
  }
}
