import { Socket } from './socketType';

export type QueueInfo = {
  client: Socket,
  nickname: string;
}

export {
  BallInfo,
  Nickname,
  Score,
  GameInfo,
  PlayerNumber,
} from '../../../type/gameType';

