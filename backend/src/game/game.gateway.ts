import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { GameService } from './game.service';
import { BallInfo, PlayerNumber } from 'src/type/gameType';
import { UseGuards } from '@nestjs/common';
import { UserService } from 'src/user.service';
import { Gateway2faGuard } from 'src/guard/gateway2fa.guard';
import { PnJwtPayload, PnPayloadDto } from 'src/dto/pnPayload.dto';
import { GameStatus } from 'src/type/gameType';


@UseGuards(Gateway2faGuard)
@WebSocketGateway({
  cors: { origin: '*' },
  path: '/socket/',
  cookie: true,
  namespace: '/game',
})
export class GameGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly gameService: GameService,
              private readonly userService: UserService) {}

  @WebSocketServer() server: Server;
  fps = 1000 / 60;

  async handleConnection(client: Socket) {
    console.log('[GameGateway] Connection', client.id);

    const pnPayload = this.userService.checkPnJwt(client);
    if (!pnPayload) return;
    this.userService.setIdMap(client.id, pnPayload.intraId);
    console.log('[GameGateway] have a pnJwt', client.id);

    const userInfo = this.userService.getUserInfo(pnPayload.intraId);
    if (!userInfo) {
        this.userService.setUserMap(pnPayload.intraId, {
        client : { game: client, chat: undefined },
        nickname: pnPayload.nickname,
        chatRoomList: [],
        gameRoom: '',
        online: true,
        blockList: [],
      });
      return ;
    } else {
      this.server.to(userInfo.client.game?.id).emit('add-tab');
      userInfo.online = true;
      userInfo.client.game = client;
    }
    console.log('[GameGateway] have a userInfo', client.id);
  }

  async handleDisconnect(client: Socket) {
    console.log('[GameGateway] Disconnection', client.id);

    if (!this.userService.checkPnJwt(client)) return ;
    console.log('[GameGateway] have pnJwt', client.id);

    const intraId = this.userService.getIntraId(client.id);
    if (!intraId) return ;

    const userInfo = this.userService.getUserInfo(intraId);
    if (!userInfo ) return ;
    userInfo.online = false;
    this.gameService.removeMatchingClient(client);
    console.log('[GameGateway] have userInfo', userInfo);
    if (userInfo.gameRoom === '') return ;
    console.log('[GameGateway] is in gameRoom', userInfo.gameRoom);

    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) return ;
    console.log('[GameGateway] emit gameInfo', client.id);

    const [ winnerId, loserId ] = this.gameService.getWinnerLoserIdDisconnect(client.id, gameInfo);
    (winnerId === gameInfo.intraId.p1) ? ++gameInfo.score.p1 : ++gameInfo.score.p2;
    this.gameService.addGameInfo(winnerId, loserId, gameInfo.gameStatus, 24, gameInfo);
    this.server.to(userInfo.gameRoom).emit('game-disconnect', {
      disconnectNickname: userInfo.nickname,
      gameInfo
    });
    const roomName = userInfo.gameRoom; // Deep copy
    this.userService.deleteUserInfoGameRoom(gameInfo);
    console.log('[GameGateway] After deleteGameRoom', roomName, this.gameService.getGameInfo(roomName));
    this.gameService.deleteGameRoom(roomName);
  }

  @SubscribeMessage('game-friendStart')
  handleFriendStart(@ConnectedSocket() client: Socket,
                    @MessageBody() payload: { gameStatus: GameStatus, friendNickname: string},
                    @PnJwtPayload() pnPayload: PnPayloadDto) {
    const userInfo = this.userService.checkGameClient(client.id, pnPayload.intraId);
    if (!userInfo) return ;

    const [ roomName, player1Id, player2Id ] = this.gameService.friendMatch(client, payload.gameStatus, pnPayload.intraId, pnPayload.nickname, payload.friendNickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-start', { roomName, player1Id, player2Id, gameStatus: GameStatus.NormalPnRun });
  }

  @SubscribeMessage('game-start')
  handleStartGame(@ConnectedSocket() client: Socket,
                  @MessageBody() payload: { gameStatus: GameStatus },
                  @PnJwtPayload() pnPayload: PnPayloadDto) {
    console.log('[Game Gateway] before game-start');
    const userInfo = this.userService.checkGameClient(client.id, pnPayload.intraId);
    if (!userInfo) return ;
    console.log('[Game Gateway] game-start', userInfo);

    const [ roomName, player1Id, player2Id, gameStatus ] =
      this.gameService.match(client, payload.gameStatus, pnPayload.intraId, pnPayload.nickname);
    if (!roomName) this.server.to(client.id).emit('game-loading');
    if (!player1Id || !player2Id) return;
    this.server.to(roomName).emit('game-start', { roomName, player1Id, player2Id, gameStatus });
  }

  @SubscribeMessage('game-keyEvent')
  handleGameKeyEvent(@ConnectedSocket() client: Socket,
                     @MessageBody() payload: any,
                     @PnJwtPayload() pnPayload: PnPayloadDto) {
    const userInfo = this.userService.checkGameClient(client.id, pnPayload.intraId);
    if (!userInfo || userInfo.gameRoom === '') return ;

    const roomName = this.gameService.getGameRoom(client);
    this.server.to(payload.opponentId).emit('game-keyEvent', {
      opponentNumber: payload.playerNumber,
      message: payload.message,
      step: payload.step,
      velocity: payload.velocity
    });
  }

  // TODO: sensor에 닿을 시 score 변경
  @SubscribeMessage('game-score')
  handleScore(@ConnectedSocket() client: Socket,
              @MessageBody() payload: { playerNumber: PlayerNumber, score: { p1: number, p2: number }},
              @PnJwtPayload() pnPayload: PnPayloadDto) {
    const userInfo = this.userService.checkGameClient(client.id, pnPayload.intraId);
    if (!userInfo || userInfo.gameRoom === '') return ;

    const gameInfo = this.gameService.getGameInfo(userInfo.gameRoom);
    if (!gameInfo) return ;

    if (this.gameService.isReadyScoreCheck(gameInfo, payload.playerNumber, payload.score)) {
      const [ winnerNickname, winnerId, loserId ] = this.gameService.checkCorrectScoreWhoWinnerEnd(gameInfo);
      console.log('INFO: 승자 발견', winnerNickname);
      gameInfo.score = !winnerNickname ? gameInfo.score : gameInfo.waitList[0].score;
      if (gameInfo.score.p1 < 5 && gameInfo.score.p2 < 5) {
        console.log('INFO: 게임 스코어');
        this.server.to(userInfo.gameRoom).emit('game-score', { realScore: gameInfo.score, winnerNickname });
      }
      else {
        console.log('INFO: DB에 저장');
        this.gameService.addGameInfo(winnerId, loserId, gameInfo.gameStatus, 42, gameInfo);
        this.server.to(userInfo.gameRoom).emit('game-end', { winnerNickname, gameInfo });
        const roomName = userInfo.gameRoom; // Deep copy
        this.userService.deleteUserInfoGameRoom(gameInfo);
        console.log('[GameGateway] After deleteGameRoom', roomName, this.gameService.getGameInfo(roomName));
        this.gameService.deleteGameRoom(roomName);
      }
      gameInfo.waitList = [];
    }
  }

  @SubscribeMessage('game-ball')
  handleBall(@ConnectedSocket() client: Socket,
             @MessageBody() ball: BallInfo,
             @PnJwtPayload() pnPayload: PnPayloadDto) {
    const userInfo = this.userService.checkGameClient(client.id, pnPayload.intraId);
    if (!userInfo || userInfo.gameRoom === '') return ;

    const updatedBallInfo = this.gameService.reconcilateBallInfo(userInfo.gameRoom, ball);
    if (!updatedBallInfo) return;
    this.server.to(userInfo.gameRoom).emit('game-ball', updatedBallInfo);
  }
}

  // @SubscribeMessage('game-disconnect')
  // handleDisconnect(@ConnectedSocket() client: Socket, @PnJwtPayload() pnPayload: PnPayloadDto) {
  //
  // }
