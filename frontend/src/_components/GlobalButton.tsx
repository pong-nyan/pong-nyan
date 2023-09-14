import Image from 'next/image';

type CatButtonProps = {
  onClickFunction: () => void;
  src: string;
  text: string;
  width: number;
  height: number;
  alt: string;
  font: string;
};

const GlobalButton = ({ onClickFunction, alt, src, text, width, height, font }: CatButtonProps) => {
  return (
    <button>
      <Image src={src} alt={alt} onClick={onClickFunction} width={width ?? 42} height={height ?? 42} />
      <p className={font}>
        {text}
      </p>
    </button>
  );
};

GlobalButton.defaultProps = {
  onClickFunction: () => { console.error('onClickFunction is not defined');},
  text: 'button',
  width: 50,
  height: 42,
};

export default GlobalButton;