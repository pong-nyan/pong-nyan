import Image from 'next/image';

type CatButtonProps = {
    onClickFunction: () => void;
    width: number;
    height: number;
};

const CatButton = ({ onClickFunction, width, height }: CatButtonProps) => {
  return (
    <button>
      <Image src="/assets/cat-footprint.png" alt="cat-footprint" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
    </button>
  );
};

CatButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  width: 42,
  height: 42,
};

export default CatButton;