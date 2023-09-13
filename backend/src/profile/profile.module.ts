import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User';
import { UserModule } from 'src/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ User ]), UserModule],
  controllers: [ProfileController],
  providers: [ProfileService]
})
export class ProfileModule {}
