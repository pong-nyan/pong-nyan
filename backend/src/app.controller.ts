import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { UserInfo } from './type/userType';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { Controller2faGuard } from 'src/guard/controller2fa.guard';

@UseGuards(Controller2faGuard)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService,
              private readonly userService: UserService) {}

  @Get('/user/me')
  getUserInfo(@PnJwtPayload() pnPayload: PnPayloadDto) {
   const userInfo = this.userService.getUserInfo(pnPayload.intraId);
   const userBlockList = userInfo.blockList;
   return userBlockList;
  }
}
