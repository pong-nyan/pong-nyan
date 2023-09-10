import { Controller, Get, Param, Query, Res, Req, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RankService } from './rank.service';
import { RankUserListDto } from './rank.dto';

@Controller('rank')
@ApiTags('rank')
export class RankController {
    constructor(private readonly rankService: RankService) { }

    @Get()
    @ApiOperation({ summary: 'get all rank', description: 'page에 설정한 모든 랭킹을 가져온다.' })
    @ApiResponse({ status: HttpStatus.OK, type: RankUserListDto, description: 'page에 모든 랭킹을 가져온다. page당 10개의 데이터' })
    @ApiParam({ name: 'page', description: 'page number, defalut = 1', required: false })
    async getRank(@Query('page') page = 1) {
        const result = await this.rankService.getRankInPage(page);
        return result;
    }
}
