import GlobalButton from '@/_components/GlobalButton';
import { GameStatus } from '@/type/gameType';
import styles from '../styles/Start.module.css';
import { socketEmitGameStartEvent } from '@/context/socketGameEvent';

const GameStartWrapper = () => {
  const buttonWidth = 120;
  const buttonHeight = 120;

  return (
    <div className={styles.buttonWrapper}>
      <div className={styles.buttonOption}>
        <GlobalButton
          onClickFunction={() => {
            socketEmitGameStartEvent(GameStatus.RankPnRun); 
          }}
          alt = "pinball rank game"
          src="/assets/pin-ball.png"
          text="rank pn"
          width={buttonWidth}
          height={buttonHeight}
          font= "fontOneMobilePop"
        />
        <GlobalButton
          onClickFunction={() => {
            socketEmitGameStartEvent(GameStatus.NormalPnRun);
          }}
          alt = "pinball game"
          src="/assets/pin-ball.png"
          text="normal pn"
          width={buttonWidth}
          height={buttonHeight}
          font= "fontOneMobilePop"
        />
        <GlobalButton
          onClickFunction={() => {
            socketEmitGameStartEvent(GameStatus.RankOriginRun);
          }}
          alt = "origin rank game"
          src="/assets/ping-pong.png"
          text="rank origin"
          width={buttonWidth}
          height={buttonHeight}
          font= "fontGalmuri"
        />
        <GlobalButton
          onClickFunction={() => {
            socketEmitGameStartEvent(GameStatus.NormalOriginRun);
          }}
          alt = "origin game"
          src="/assets/ping-pong.png"
          text="normal origin"
          width={buttonWidth}
          height={buttonHeight}
          font= "fontGalmuri"
        />
      </div>
    </div>
  );
};

export default GameStartWrapper;
