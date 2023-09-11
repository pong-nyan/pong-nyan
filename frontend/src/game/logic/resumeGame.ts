import { setStartBall } from '@/game/matterEngine/matterJsSet';
import { Engine, Body } from 'matter-js';
import { findTarget } from '@/game/matterEngine/matterJsUnit';
import { CanvasSize, Timer } from '@/type/gameType';

export const resumeGame = (sceneSize: CanvasSize, engine: Engine, timer: number, infoText: string) => {
  // 미리 공을 세팅해놓고 3초 뒤에 공을 움직이게 함. 순서 바꾸면 벽이 뚫리는 버그 발생
  const ball = findTarget(engine.world, 'Ball');
  if (!ball) return;
  Body.setPosition(ball, { x: sceneSize.width / 2, y: sceneSize.height / 2});
  Body.setStatic(ball, true);
  setStartBall(engine.world, 'player1');
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  countdown.innerText = infoText;
  let count = timer;
  const countdownInterval = setInterval(() => {  // 간격 설정
    if (count >= 1) {
      countdown.innerText = count.toString();  // 카운트 다운 표시
    } else if (count === 0) {
      countdown.innerText = 'Fight!!!';  // 카운트 다운 초기화
      Body.setStatic(ball, false);  // 볼 상태 변경
    } else {
      countdown.innerText = '';  // 카운트 다운 초기화
      clearInterval(countdownInterval);  // 간격 중지
      if (timer === Timer.First) {
        console.log('socketEmitGameEnd');
      }
    }
    --count;
  }, 1000);  // 1초 간격
};
