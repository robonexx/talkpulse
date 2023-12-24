
import styles from './Pagination.module.scss';

interface PaginatorProps {
  currentPage: number;
  totalPages: number;
  setPage: (page: number) => void;
}

const Pagination = (props: PaginatorProps) => {
   /*  const pages = Array.from(Array(props.totalPages).keys()).map((i) => i + 1); */
    const pages = Array.from({length: props.totalPages}, (_, i) => i + 1)

  return (
    <div className={styles.pagination}>
      {pages.map((page) => (
        <button key={page} className={page === props.currentPage ? styles.active : ''} onClick={() => props.setPage(page)}>{page}</button>
      ))}
    </div>
  );
};

export default Pagination;
