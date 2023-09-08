import Image from 'next/image';

type CatButtonProps = {
    onClickFunction: () => void;
    label: string;
    width: number;
    height: number;
};

const CatButton = ({ onClickFunction, label, width, height }: CatButtonProps) => {
  return (
    <button>
      <Image src="/assets/cat-footprint.png" alt="catFootprint" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
      {label}
    </button>
  );
};

CatButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  label: 'button',
  width: 42,
  height: 42,
};

export default CatButton;