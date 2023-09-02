
const MakeChannel = () => {
  return (
    <div className="make-channel">
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
        <input type="checkbox" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>비공개방</span>
        <input type="checkbox" />
      </div>
      <div className="make-channel__input" style={{ display: 'flex', alignItems: 'center' }}>
        <span style={{ marginRight: '10px' }}>초대방</span>
        <input type="checkbox" />
      </div>
    </div>
  );
};

export default MakeChannel;