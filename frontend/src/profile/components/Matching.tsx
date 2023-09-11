const Matching = ({ nickname }: { nickname: string}) => {
  const startMatching = () => {
    alert(`${nickname} 에게 게임신청, 상대도 매칭시작을 눌러야 게임을시작합니다.`);
  };

  return (
    <div>
      <button type="button" onClick={startMatching}>매칭 시작</button>
    </div>
  );
};

export default Matching;