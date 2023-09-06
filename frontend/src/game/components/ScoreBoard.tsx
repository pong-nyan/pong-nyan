import{ useEffect, useRef } from 'react';
import { Score, PlayerNumber } from '@/game/gameType';

export const ScoreBoard = ({score, playerNumber}: {score: Score, playerNumber: PlayerNumber | undefined})  => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!playerNumber) return;
    const canvas = canvasRef.current;
    if (!canvas) return; // Element가 없으면 종료

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Context가 없으면 종료

    const img = new Image();
    img.src = '/assets/game-map.png';  // 이미지의 URL을 여기에 넣으세요.
    //
    img.onload = () => {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);  // 이미지를 캔버스 크기에 맞게 그립니다.
      const fontSize = 120;
      const fontType = 'Arial';
      ctx.font = `${fontSize}px ${fontType}`;

      // 글자 중간 좌표
      const middleX1 = (canvas.clientWidth - ctx.measureText(`${score.p1}`).width) / 2;
      const middleX2 = (canvas.clientWidth - ctx.measureText(`${score.p2}`).width) / 2;

      // 글자 높이는 가져오는 거 없어서 font size 바뀌면 하드코딩 해야함
      const baseHeight1 = 89;
      const baseHeight2 = canvas.clientHeight - 4;
      const offsetHeight = 60;

      // 텍스트 렌더링 (x, y 좌표는 텍스트의 시작점)
      ctx.fillStyle = 'rgba(165, 42, 42, 0.8)';
      if (playerNumber === 'player1') {
        ctx.fillText(`${score.p2}`, middleX2, baseHeight1 + offsetHeight);  // Top
        ctx.fillText(`${score.p1}`, middleX1, baseHeight2 - offsetHeight);  // Bottom

      } else if (playerNumber === 'player2') {
        ctx.fillText(`${score.p1}`, middleX1, baseHeight1 + offsetHeight);  // Top
        ctx.fillText(`${score.p2}`, middleX2, baseHeight2 - offsetHeight);  // Bottom
      }
    };

    // ctx.fillStyle = 'green';
    // ctx.fillRect(0, 0, canvas.width, canvas.height);

  }, [score, playerNumber]);
  //  playerNumber 가 2 이면 canvas 의 위아래를 바꿔서 렌더링 해야함

  if (playerNumber === 'player2') return <canvas ref={canvasRef} width="300" height="500" style={{transform: 'rotate(180deg)'}}></canvas>;
  else return <canvas ref={canvasRef} width="300" height="500"></canvas>;
};

