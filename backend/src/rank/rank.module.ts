import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entity/User';

@Module({
  imports: [TypeOrmModule.forFeature([ User ])],
  controllers: [RankController],
  providers: [RankService]
})
export class RankModule {}
