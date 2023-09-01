import{ useState, useEffect, useRef } from 'react';
import { Score } from '../../type';

// export const ScoreBoard = () => {
//   const [players, setPlayers] = useState<Player[]>(initialPlayers);
//
//
//   const incrementScore = (id: number) => {
//     const updatedPlayers = players.map((player) => {
//       if (player.id === id) {
//         return { ...player, score: player.score + 1 };
//       }
//       return player;
//     });
//     setPlayers(updatedPlayers);
//   };
//
//   return (
//     <div style={{ position: 'relative' }}>
//       <div style={{ position: 'absolute', top: 0, left: 0, zIndex: 1 }}>
//         <table>
//           <tbody>
//             {players.map((player) => (
//               <tr key={player.id}>
//                 <td>{player.score}</td>
//                 <td>
//                   <button onClick={() => incrementScore(player.id)}>+1</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

export const ScoreBoard = ({score}: {score: Score})  => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return; // Element가 없으면 종료

    const ctx = canvas.getContext('2d');
    if (!ctx) return; // Context가 없으면 종료

    //배경색을 빨강으로 설정
    ctx.fillStyle = 'green';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 글꼴과 크기 설정
    //
    const fontSize = 120;
    const fontType = 'Arial';
    ctx.font = `${fontSize}px ${fontType}`;

    const middleX1 = (canvas.clientWidth - ctx.measureText(`${score.p1}`).width) / 2;
    const middleX2 = (canvas.clientWidth - ctx.measureText(`${score.p2}`).width) / 2;
    const baseHeight1 = 89;
    const baseHeight2 = canvas.clientHeight - 4;
    const offsetHeight = 60;
    console.log(middleX1, middleX2);
    // 텍스트 렌더링 (x, y 좌표는 텍스트의 시작점)
    ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
    ctx.fillText(`${score.p1}`, middleX1, baseHeight1 + offsetHeight);
    ctx.fillText(`${score.p2}`, middleX2, baseHeight2 - offsetHeight);
  }, [score]);

  return <canvas ref={canvasRef} width="300" height="500"></canvas>;
};

