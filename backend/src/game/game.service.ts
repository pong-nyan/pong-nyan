import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    matchingQueue: Socket[] = [];

    match(client: Socket) {
        this.matchingQueue.push(client);

        if (this.matchingQueue.length > 1) {
            const player1 = this.matchingQueue.shift();
            const player2 = this.matchingQueue.shift();
            const roomName = player1.id + player2.id;
            console.log('roomName:', roomName);
            player1.join(roomName);
            player2.join(roomName);
            const p1 = player1.id;
            const p2 = player2.id;
            return { roomName, p1, p2 };
        }
        return undefined;
    }
}


