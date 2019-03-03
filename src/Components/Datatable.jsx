/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Filter from './Filter';
import Paginator from './Paginator';

import '../styles/Datatable.css';

export default class Datatable extends Component {
  static defaultProps = {
    items: [],
  }

  state = {
    currentPage: 1,
    renderedItems: [...this.props.items],
    defaultItems: [...this.props.items],
    isAllSelected: false,
    perPage: 5,
    columns: { ...this.props.columnConfig },
    currentQuery: '',
    sortKey: '',
    sortOrder: 'asc',
  }

  getData() {
    const { renderedItems } = this.state;
    return renderedItems;
  }

  getSelected() {
    const { renderedItems } = this.state;
    return renderedItems.filter(item => item.selected);
  }

  _selectAllItems = () => {
    const { isAllSelected } = this.state;
    let flag = true;
    if (isAllSelected) {
      flag = false;
    }

    this._setSelectedToEveryItem(flag);

    this.setState({
      isAllSelected: flag,
    });
  }

  _setSelectedToEveryItem = (flag) => {
    const { renderedItems } = this.state;
    renderedItems.forEach((item) => {
      // eslint-disable-next-line no-param-reassign
      item.selected = flag;
    });
  }

  _setColumnClass = (key, notSortable) => {
    const { sortKey, sortOrder } = this.state;
    let className = '';
    if (sortOrder && sortKey === key) {
      className = sortOrder;
    } else if (notSortable) {
      className = 'unsorted';
    }
    return className;
  }

  _selectItem = (itemId) => {
    const { renderedItems } = this.state;
    const newItems = [...renderedItems];

    const itemIndex = newItems.findIndex(item => item.id === itemId);
    if (itemIndex >= 0) {
      const isElemSelected = newItems[itemIndex].selected;
      newItems[itemIndex].selected = !isElemSelected;

      // check if all items are selected
      let selectedAmount = 0;
      let isAllSelected = false;
      renderedItems.forEach((item) => {
        if (item.selected) {
          selectedAmount++;
        }
      });

      if (renderedItems.length === selectedAmount) {
        isAllSelected = true;
      }

      this.setState({ isAllSelected, renderedItems: newItems });
    }
  }

  _sortCallback = (sortBy, order) => {
    if (order === 'desc') {
      return (a, b) => {
        switch (typeof a[sortBy]) {
          case 'number':
            return b[sortBy] - a[sortBy];

          case 'string':
            return b[sortBy].localeCompare(a[sortBy]);

          default:
            return 1;
        }
      };
    }
    return (a, b) => {
      switch (typeof a[sortBy]) {
        case 'number':
          return a[sortBy] - b[sortBy];

        case 'string':
          return a[sortBy].localeCompare(b[sortBy]);

        default:
          return 1;
      }
    };
  }

  _sortItems = (sortBy) => {
    this.setState((prevState) => {
      let order;
      if (prevState.sortOrder === 'asc') {
        order = 'desc';
      } else {
        order = 'asc';
      }

      return {
        renderedItems: prevState.renderedItems.sort(this._sortCallback(sortBy, order)),
        sortKey: sortBy,
        sortOrder: order,
      };
    });
  }

  handleFilterChange = (query) => {
    const { columns, defaultItems } = this.state;

    const config = Object.entries(columns);
    const regexp = new RegExp(query, 'i');

    const filteredItems = defaultItems
      .filter((item) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const entry of config) {
          const key = entry[0];
          const colConfig = entry[1];

          if (colConfig.isSearchable && regexp.test(item[key])) {
            return true;
          }
        }
        return false;
      });

    this._setSelectedToEveryItem(false);

    this.setState({
      currentPage: 1,
      isAllSelected: false,
      currentQuery: query,
      renderedItems: filteredItems,
    });
  }

  handlePageChange = (currentPage) => {
    this.setState({ currentPage });
  }

  handlePerPageChange = (perPage) => {
    this.setState({ currentPage: 1, perPage });
  }

  _renderItem = (item) => {
    const { columns } = this.state;
    return (
      <tr key={item.id}>
        <td>
          <input
            type="checkbox"
            checked={item.selected || false}
            onChange={() => this._selectItem(item.id)}
          />
        </td>
        {Object.keys(columns).map((col, i) => (
          // eslint-disable-next-line react/no-array-index-key
          <td key={i}>{item[col]}</td>
        ))}
      </tr>
    );
  }

  _renderHeader = () => {
    const { isAllSelected, columns } = this.state;
    return (
      <thead>
        <tr>
          <th>
            <input
              type="checkbox"
              checked={isAllSelected}
              onChange={this._selectAllItems}
            />
          </th>
          {Object.entries(columns).map(([key, config]) => (
            <th
              key={key}
              className={this._setColumnClass(key, config.isSortable)}
              onClick={() => this._sortItems(config.isSortable ? key : '')}
            >
              {config.title}
            </th>
          ))}
        </tr>
      </thead>
    );
  }

  pagesCount = () => {
    const { perPage, renderedItems } = this.state;

    return Math.ceil(renderedItems.length / perPage);
  }

  render() {
    const {
      renderedItems,
      currentQuery,
      perPage,
      currentPage,
    } = this.state;

    const startIndex = (currentPage - 1) * perPage;
    const endIndex = startIndex + perPage;
    const visibleItems = renderedItems.slice(startIndex, endIndex);

    return (
      <>
        <Filter query={currentQuery} onChange={this.handleFilterChange} />
        <Paginator
          onPageChange={this.handlePageChange}
          onPerPageChange={this.handlePerPageChange}
          perPage={perPage}
          currentPage={currentPage}
          pagesCount={this.pagesCount()}
          totalItems={renderedItems.length}
          selector
        />

        <table className="tabledata">
          {this._renderHeader()}
          <tbody>
            {visibleItems.map(item => this._renderItem(item))}
          </tbody>
        </table>

        <Paginator
          onPageChange={this.handlePageChange}
          perPage={perPage}
          currentPage={currentPage}
          pagesCount={this.pagesCount()}
          totalItems={renderedItems.length}
          info
        />
      </>
    );
  }
}

Datatable.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    age: PropTypes.number,
    id: PropTypes.string.isRequired,
    imageUrl: PropTypes.string,
    name: PropTypes.string,
    snippet: PropTypes.string,
  })),
  columnConfig: PropTypes.shape({
    title: PropTypes.string,
    isSortable: PropTypes.bool,
    isSearchable: PropTypes.bool,
  }).isRequired,
};
