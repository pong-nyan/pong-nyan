import Image from 'next/image';

type CatButtonProps = {
    onClickFunction: () => void;
    text: string;
    width: number;
    height: number;
};

const CatButton = ({ onClickFunction, text, width, height }: CatButtonProps) => {
  return (
    <button>
      <Image src="/assets/cat-footprint.png" alt="catFootprint" onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
      <p>
        {text}
      </p>
    </button>
  );
};

CatButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  text: 'button',
  width: 50,
  height: 42,
};

export default CatButton;