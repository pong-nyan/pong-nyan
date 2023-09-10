import { Module } from '@nestjs/common';
import { RankController } from './rank.controller';
import { RankService } from './rank.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VRanking } from 'src/entity/VRanking';

@Module({
  imports: [TypeOrmModule.forFeature([ VRanking ])],
  controllers: [RankController],
  providers: [RankService]
})
export class RankModule {}
