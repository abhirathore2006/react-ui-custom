import React, { useMemo, useState } from 'react';
import { getValue } from './tableHelper';
export const TextFilter = ({ name, onChange }) => {
  return <input name={name} onChange={e => onChange(name, e.target.value)} />;
};
const NumberFilter = ({ name, onChange }) => {
  return (
    <input name={name} onChange={e => onChange(name, Number(e.target.value))} />
  );
};

export const SelectFilter = ({ name, onChange, prefilteredRows }) => {
  const selectOptions = useMemo(() => {
    let options = new Set();
    prefilteredRows.forEach(r => {
      if (r[name] || isValidValue(r[name])) {
        options.add(r[name]);
      }
    });
    return Array.from(options.values());
  }, [prefilteredRows, name]);
  return (
    <select onChange={e => onChange(name, e.target.value)}>
      <option value="">All</option>
      {selectOptions.map(s => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
};

export const Filter = ({ column, onChange, prefilteredRows }) => {
  if (!column.Filter) {
    return <TextFilter name={column.accessor} onChange={onChange} />;
  }
  if (typeof column.Filter === 'string') {
    switch (column.Filter) {
      case 'select':
        return (
          <SelectFilter
            name={column.accessor}
            onChange={onChange}
            prefilteredRows={prefilteredRows}
          />
        );
      case 'text':
        return <TextFilter name={column.accessor} onChange={onChange} />;
      case 'number':
        return <NumberFilter name={column.accessor} onChange={onChange} />;
    }
  } else if (typeof column.Filter === 'function') {
    return (
      <column.Filter
        name={column.accessor}
        onChange={onChange}
        prefilteredRows={prefilteredRows}
      />
    );
  }
};

export const FILTER_TYPES = {
  EQUALS: 'equals',
  EQUALS_NUMBER: 'equalsNumber',
  MATCH: 'match',
  STARTS_WITH: 'startWith'
};
function isValidValue(val) {
  let flag = false;
  flag = flag || val === null;
  flag = flag || val === undefined;
  flag = flag || (typeof val === 'string' && val.trim() === '');
  return !flag;
}
function performFilter(data, filters, columns) {
  let filteredData = data;
  filteredData = Object.keys(filters).reduce((acc, key) => {
    let column = columns.find(c => c.accessor === key);
    const filterValue = filters[key];
    if (!column || !isValidValue(filterValue)) {
      return acc;
    }
    if (typeof column.filter === 'function') {
      return column.filter({ rows: acc, column, key, fiterValue, getValue });
    }
    switch (column.filter) {
      case FILTER_TYPES.EQUALS: {
        return acc.filter(v => getValue(v, key, '') === filterValue);
      }
      case FILTER_TYPES.EQUALS_NUMBER: {
        return acc.filter(v => getValue(v, key, '') === Number(filterValue));
      }
      case FILTER_TYPES.MATCH: {
        let r = new RegExp(String(filterValue), 'im');
        return acc.filter(v => r.test(getValue(v, key, '')));
      }
      case FILTER_TYPES.STARTS_WITH: {
        let r = new RegExp('^' + String(filterValue), 'im');
        return acc.filter(v => r.test(getValue(v, key, '')));
      }
      default: {
        let r = new RegExp(String(filterValue), 'im');
        return acc.filter(v => r.test(getValue(v, key, '')));
      }
    }
  }, filteredData);
  return filteredData;
}

export const useFilter = ({ data, columns, hasFilter }) => {
  if (!hasFilter) {
    return data;
  }
  const [filters, setFilters] = useState({});

  const onFilterChange = (name, value) => {
    setFilters(filter => ({ ...filter, [name]: value }));
  };
  const filteredData = useMemo(() => performFilter(data, filters, columns), [
    data,
    filters,
    columns
  ]);
  return { filteredData, filters, onFilterChange, Filter };
};
