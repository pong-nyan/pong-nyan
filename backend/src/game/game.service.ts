import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';

@Injectable()
export class GameService {
    matchingQueue: Socket[];


    match(client: Socket) {
        if (!this.matchingQueue) {
            this.matchingQueue = [];
        }
        if (this.matchingQueue.length === 0) {
            // create new room
            client.join('room1');
        } else {
            // join room
            client.join('room1');
        }
    }


}
