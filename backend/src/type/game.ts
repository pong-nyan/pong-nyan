export type BallInfo = {
    position: {
        x: number;
        y: number;
    };
    velocity: {
        x: number;
        y: number;
    };
}

export type GameInfo = {
    roomName: string;
    p1: string; // nickname
    p2: string; // nickname
    score: {
        p1: number;
        p2: number;
    };
}

export type RoomName = string;
