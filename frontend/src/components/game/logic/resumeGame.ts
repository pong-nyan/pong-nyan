import { setStartBall } from '@/matterEngine/matterJsSet';
import { Engine, Body } from 'matter-js';
import { findTarget } from '@/matterEngine/matterJsUnit';
const resumeGame = (engine: Engine) => {
  // 미리 공을 세팅해놓고 3초 뒤에 공을 움직이게 함. 순서 바꾸면 벽이 뚫리는 버그 발생
  setStartBall(engine.world);
  setTimeout(() => {
    Body.setStatic(findTarget(engine.world, 'Ball'), false);
  }, 3000);
  const countdown = document.getElementById('countdown');
  if (!countdown) return;

  countdown.innerText = '3';
  setTimeout(() => {
    countdown.innerText = '2';
  }, 1000);
  setTimeout(() => {
    countdown.innerText = '1';
  }, 2000);
  setTimeout(() => {
    countdown.innerText = '';
  }, 3000);
};

export { resumeGame };