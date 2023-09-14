import { PaginationProps } from '../../type/rankType';
import styles from '@/rank/styles/Rank.module.css';

const Pagination = ({ currentPage, handleCurrentPage}: PaginationProps) => {
  return (
    <span className={styles.font}>
      <div className={styles.pagination}>
        <button onClick={() => handleCurrentPage(currentPage - 1)}>이전</button>
        {currentPage}
        <button onClick={() => handleCurrentPage(currentPage + 1)}>다음</button>
      </div>
    </span>
  );
};

export default Pagination;