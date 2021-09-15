import React, { useMemo, useState, useRef } from 'react';
import { getValue } from './tableHelper';
import { SortIcon } from './icons/sort';
import { SortAscIcon } from './icons/sortAsc';
import { SortDescIcon } from './icons/sortDesc';
const SORT_DIRECTIONS = {
  ASC: 'ASC',
  DESC: 'DESC'
};
const SORT_ICONS = {
  ASC: <SortAscIcon />,
  DESC: <SortDescIcon />
};

function alphaNumericSort(row1, row2, key) {
  let val1 = getValue(row1, key, '');
  let val2 = getValue(row2, key, '');
  let isVal1Invalid = val1 === null || val1 === undefined;
  let isVal2Invalid = val2 === null || val2 === undefined;
  if (isVal1Invalid && isVal2Invalid) {
    return 0;
  }
  if (isVal1Invalid) {
    return -1;
  }
  if (isVal2Invalid) {
    return 1;
  }
  val1 = String(val1);
  val2 = String(val2);
  return val1.localeCompare(val2, undefined, {
    numeric: true,
    caseFirst: false
  });
}
export const useSort = ({ data, hasSort, columns }) => {
  const [{ sortKey, sortOrder }, setState] = useState({
    sortKey: '',
    sortOrder: ''
  });
  const onSort = (name, direction) => {
    if (sortKey === name && sortOrder === SORT_DIRECTIONS.DESC) {
      setState({ sortKey: '', sortOrder: '' });
    } else {
      setState({ sortKey: name, sortOrder: direction });
    }
  };

  const Sort = ({ column }) => {
    const isActiveSort = column.accessor === sortKey;
    let sortIcon = <SortIcon />;
    let nextSortOrder = SORT_DIRECTIONS.ASC;
    if (isActiveSort) {
      sortIcon = SORT_ICONS[sortOrder];
      nextSortOrder =
        sortOrder === SORT_DIRECTIONS.ASC
          ? SORT_DIRECTIONS.DESC
          : SORT_DIRECTIONS.ASC;
    }

    return (
      <span
        role="button"
        onClick={() => onSort(column.accessor, nextSortOrder)}
      >
        {sortIcon}
      </span>
    );
  };

  const sortedData = useMemo(() => {
    if (!hasSort || !sortKey || !sortOrder) {
      return data;
    }
    const sortColumn = columns.find(c => c.accessor === sortKey);
    if (!sortColumn) {
      return data;
    }

    let sortFn = alphaNumericSort;
    const isReverse = SORT_DIRECTIONS.DESC === sortOrder;
    let sortedData = data.slice();
    sortedData.sort((a, b) => {
      return isReverse
        ? sortFn(b, a, sortKey, getValue)
        : sortFn(a, b, sortKey, getValue);
    });
    return sortedData;
  }, [sortKey, sortOrder, data, hasSort]);
  return {
    sortedData,
    Sort
  };
};
