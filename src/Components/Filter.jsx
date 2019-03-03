/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import '../styles/Filter.css';

// import debounce from 'lodash.debounce';

// const QUERY_CHANGE_DELAY = 600;

const Filter = (props) => {
  const { query, onChange } = props;
  return (
    <label className="filter">
      Search:
      <input
        onChange={event => onChange(event.target.value)}
        value={query}
      />
    </label>
  );
};

Filter.propTypes = {
  query: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};
Filter.defaultProps = {
  query: '',
};

export default Filter;
// debounce в 16 строке не заработал, хз как поправить
// {/* onChange={event => debounce(() => onChange(event.target.value), QUERY_CHANGE_DELAY)} */}
