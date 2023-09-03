
// 채널 생성 컴포넌트
const MakeChannel = () => {
  return (
    <div className="make-channel" style={{backgroundColor: 'lightblue'}}>
      <button>
        채널
      </button>
      <button>
        DM
      </button>
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ margin: 0, marginRight: '10px' }}>방 제목 : </p>
          <input type="text" placeholder="channel제목을 입력해주세요." />
        </div>
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>공개방</span>
        <input type="radio" name="channelType" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>비공개방</span>
        <input type="radio" name="channelType" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>초대방</span>
        <input type="radio" name="channelType" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="text" placeholder="비밀번호를 입력해주세요" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <input type="button" value="채널생성" />
      </div>
    </div>
  );
};

export default MakeChannel;