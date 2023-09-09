import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
 // TODO: after table setting, change this code
  imports: [],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
