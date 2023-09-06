export type Channel = ChannelInfo & {
    id: string,
    owner: string,
    administrator: string[],
    userList: string[],
    invitedUsers: string[]
}

export type ChannelInfo = {
    title: string,
    password?: string,
    channelType: ChannelType,
    maxUsers: number,
}

export type ChannelType = 'public' | 'private' | 'protected';

export type KeyEventMessage = 'leftDown' | 'rightDown' | 'leftUp' | 'rightUp' | 'spaceDown' | 'spaceUp';

export type Player = {
    hingeLeft: Matter.Body;
    hingeRight: Matter.Body;
    paddleLeft: Matter.Body;
    paddleRight: Matter.Body;
    stopperLeftTop: Matter.Body;
    stopperLeftBottom: Matter.Body;
    stopperRightTop: Matter.Body;
    stopperRightBottom: Matter.Body;
    jointLeft: Matter.Constraint;
    joinRight: Matter.Constraint;
}

export type PlayerNumber = 'player1' | 'player2';

export type CollisionEvent = {
    playerNumber: PlayerNumber;
}

export type KeyDownEvent = {
    playerNumber: PlayerNumber;
    data: string;
}

export type KeyUpEvent = {
    playerNumber: PlayerNumber;
    data: string;
}

export type Score = {
    p1: number,
    p2: number
}

export type CanvasSize = {
    width: number,
    height: number
}

//nav button types
// home button
export type HomeButtonProps = {
    onClickFunction: () => void;
};

// list button
export type ListButtonProps = {
    onClickFunction: () => void;
};

// publicRomm button
export type PublicChannelListButtonProps = {
    onClickFunction: () => void;
};

// game button
export type GameButtonProps = {
    onClickFunction: () => void;
};