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
            player1.join(roomName);
            player2.join(roomName);
            console.log('player1  ', player1.rooms, '\nplayer2  ', player2.rooms);
        }
    }
}


