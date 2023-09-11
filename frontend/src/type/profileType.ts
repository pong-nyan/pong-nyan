export type Game = {
    id: number;
    gameMode: number;
    gameInfo: JSON;
};

export type ProfileProps = {
    nickname: string;
  };
  
export type ProfileData = {
    intraId: number;
    avatar: string;
    nickname: string;
    rankScore: number;
    winnerGames: Game;
    loserGames: Game;
};
  