import { Controller, Get, UseGuards, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UserService } from './user.service';
import { Nickname } from './type/userType';
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
   return { userBlockList };
  }

  @Post('/user/block')
  updateBlockList(@PnJwtPayload() pnPayload: PnPayloadDto, @Body('nickname') blockNickname: Nickname) {
    const userInfo = this.userService.getUserInfo(pnPayload.intraId);

    userInfo.blockList.push(blockNickname);
    return userInfo.blockList;
  }
}
