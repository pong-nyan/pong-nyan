import { setStartBall } from '@/game/matterEngine/matterJsSet';
import { Engine, Body } from 'matter-js';
import { findTarget } from '@/game/matterEngine/matterJsUnit';
import { PlayerNumber } from '@/game/gameType';

export const resumeGame = (engine: Engine, infoText: string) => {
  // 미리 공을 세팅해놓고 3초 뒤에 공을 움직이게 함. 순서 바꾸면 벽이 뚫리는 버그 발생
  const ball = findTarget(engine.world, 'Ball');
  if (!ball) return;
  Body.setStatic(ball, true);
  setStartBall(engine.world, 'player1');
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  let counter = 4;  // 시작 카운트
  countdown.innerText = infoText;
  const countdownInterval = setInterval(() => {  // 간격 설정
    if (--counter >= 1 && counter <= 3) {
      countdown.innerText = counter.toString();  // 카운트 다운 표시
    } else if (counter === 0) {
      countdown.innerText = 'Fight!!!';  // 카운트 다운 초기화
      Body.setStatic(ball, false);  // 볼 상태 변경
    } else {
      countdown.innerText = '';  // 카운트 다운 초기화
      clearInterval(countdownInterval);  // 간격 중지
    }
  }, 1000);  // 1초 간격
};
