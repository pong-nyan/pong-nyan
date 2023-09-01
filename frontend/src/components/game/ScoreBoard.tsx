import{ useEffect, useRef } from 'react';
import { Score } from '../../type';

export const ScoreBoard = ({score}: {score: Score})  => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Element가 없으면 종료

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Context가 없으면 종료

    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

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
    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.fillText(`${score.p1}`, middleX1, baseHeight1 + offsetHeight);
    ctx.fillText(`${score.p2}`, middleX2, baseHeight2 - offsetHeight);
  }, [score]);

  return <canvas ref={canvasRef} width="300" height="500"></canvas>;
};

