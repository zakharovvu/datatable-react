/* eslint-disable react/jsx-one-expression-per-line */
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Paginator.css';

const Paginator = (props) => {
  const {
    onPageChange,
    onPerPageChange,
    perPage,
    currentPage,
    pagesCount,
    selector,
    info,
    totalItems,
  } = props;

  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;

  const getPages = () => {
    const pages = [];

    for (let i = 1; i <= pagesCount; i++) {
      pages.push(i);
    }

    return pages;
  };

  const handlePageSelect = (page) => {
    const correctPage = Math.min(
      Math.max(1, page), pagesCount,
    );

    onPageChange(correctPage);
  };

  const handlePrevPageSelect = () => {
    handlePageSelect(props.currentPage - 1);
  };

  const handleNextPageSelect = () => {
    handlePageSelect(props.currentPage + 1);
  };

  const handlePerPageSelect = (event) => {
    onPerPageChange(+event.target.value);
  };

  return (
    <div className="paginator">
      {selector
        ? (
          <select value={perPage} onChange={handlePerPageSelect}>
            {[3, 5, 10, 20].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )
        : ''
      }

      <button type="button" className="paginator__page-button" onClick={handlePrevPageSelect}>{'<-'}</button>
      {getPages().map(page => (
        <button
          key={page}
          type="button"
          onClick={() => handlePageSelect(page)}
          className={(page === currentPage) ? 'paginator__page-button paginator__page-button--current' : 'paginator__page-button'}
        >
          { page }
        </button>
      ))}
      <button type="button" className="paginator__page-button" onClick={handleNextPageSelect}>{'->'}</button>

      {info
        ? (
          <span data-element="page-info" className="paginator__page-info">
              Show {startIndex + 1} to {Math.min(endIndex, totalItems)} phones from {totalItems}
          </span>
        )
        : ''
      }
    </div>
  );
};

Paginator.propTypes = {
  onPageChange: PropTypes.func,
  onPerPageChange: PropTypes.func,
  perPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  pagesCount: PropTypes.number.isRequired,
  totalItems: PropTypes.number.isRequired,
  selector: PropTypes.bool,
  info: PropTypes.bool,
};
Paginator.defaultProps = {
  onPageChange: () => null,
  onPerPageChange: () => null,
  selector: false,
  info: false,
};

export default Paginator;
