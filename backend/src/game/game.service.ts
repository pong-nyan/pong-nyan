import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { BallInfo, RoomName } from 'src/type/game';

@Injectable()
export class GameService {
    matchingQueue: Socket[] = [];
    recentBallInfMap = new Map<RoomName, BallInfo>();

    match(client: Socket) {
        this.matchingQueue.push(client);

        if (this.matchingQueue.length > 1) {
            const prefix = 'game-';
            const player1 = this.matchingQueue.shift();
            const player2 = this.matchingQueue.shift();
            const roomName = prefix + player1.id + player2.id;
            player1.join(roomName);
            player2.join(roomName);
            const p1 = player1.id;
            const p2 = player2.id;
            return { roomName, p1, p2 };
        }
        return undefined;
    }

    reconcilateBallInfo(roomName: RoomName, ballInfo: BallInfo) : BallInfo | undefined {
        const recentBallInfo = this.recentBallInfMap.get(roomName);
        const accepableDiff = 0.1;
        if (!recentBallInfo) {
            this.recentBallInfMap.set(roomName, ballInfo);
            return undefined;
        }
        const diffX = Math.abs(ballInfo.position.x - recentBallInfo.position.x);
        const diffY = Math.abs(ballInfo.position.y - recentBallInfo.position.y);
        const diffVx = Math.abs(ballInfo.velocity.x - recentBallInfo.velocity.x);
        const diffVy = Math.abs(ballInfo.velocity.y - recentBallInfo.velocity.y);
        console.log(diffVx, diffVy, diffX, diffY);
        if (diffX > accepableDiff || diffY > accepableDiff || diffVx > accepableDiff || diffVy > accepableDiff) {
            this.recentBallInfMap.set(roomName, ballInfo);
            return ballInfo;
        }
        return undefined;
    }
}


