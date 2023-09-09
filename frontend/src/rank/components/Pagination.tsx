import { PaginationProps } from '../rankType';

const Pagination = ({ currentPage, handleCurrentPage}: PaginationProps) => {
  return (
    <>
      <button onClick={() => handleCurrentPage(currentPage - 1)}>이전</button>
      {currentPage}
      <button onClick={() => handleCurrentPage(currentPage + 1)}>다음</button>
    </>
  );
};

export default Pagination;