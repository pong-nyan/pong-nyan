import { Game, GameModeEnum } from '@/type/profileType';
import styles from '@/profile/styles/RecentGame.module.css';

const RecentGame = ({ game, label }: { game: Game[], label: string }) => {
  return (
    <>
      {game.length > 0 && <h3>{label}</h3>}
      {
        game?.map((g) => (
          <div key={g.id} className={styles.game}>
            <div className={styles.gameMode}>게임모드 : {g.gameMode === GameModeEnum.Rank ? '랭크' : '일반'}</div>
            <div className={styles.createdAt}>게임시간 : {g.createdAt}</div>
            <div className={styles.nickname}>게임참여자 : {JSON.stringify(g.gameInfo.nickname)}</div>
            <div className={styles.score}>게임점수 : {JSON.stringify(g.gameInfo.score)}</div>
          </div>        
        ))
      }
    </>
  );
};

export default RecentGame;