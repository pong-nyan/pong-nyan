import CatButton from '@/components/button/CatButton';
const CustomButtonTestPage = () => {
  const IWantToAlert = () => {
    alert('I am clicked!');
  };

  return (
    <div>
      <h1>CustomButtonTestPage</h1>
      <CatButton onClickFunction={IWantToAlert} />
    </div>
  );
};

export default CustomButtonTestPage;