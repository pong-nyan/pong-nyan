export type Game = {
    id: number;
    gameMode: number;
    gameInfo: JSON;
};

export enum GameModeEnum {
    Normal = 0,
    Rank = 1
}

export type ProfileProps = {
    nickname: string;
  };
  
export type ProfileData = {
    intraId: number;
    avatar: string;
    nickname: string;
    rankScore: number;
    winnerGames: Game[];
    loserGames: Game[];
};
 