import { Game, GameModeEnum } from '@/type/profileType';

const RecentGame = ({ game }: { game: Game[] }) => {
  return (
    <>
      {
        game?.map((g) => (
          <div key={g.id}>
            <div>{g.gameMode === GameModeEnum.Rank ? '랭크' : '일반'}</div>
            {/* TODO: show gameInfo pretty */}
            {JSON.stringify(g.gameInfo)}
          </div>        
        ))
      }
    </>
  );
};

export default RecentGame;