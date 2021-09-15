import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import { useFilter, FILTER_TYPES, SelectFilter } from './useFilter';
import { useSort } from './useSort';
import { getValue } from './tableHelper';
import './TpsTable.scss';

const TableWrapper = styled.div`
  box-sizing: border-box;
`;
const StyledTable = styled.table`
  width: ${p => (p.$fluid ? '100%' : `${p.$tableWidth}px`)};
  max-height: ${p => (p.$height ? `${p.$height}px` : '100%')};
`;

const StyledTd = styled.td`
  min-height: auto;
`;
const StyledTh = styled.th`
  min-height: auto;
  padding: 4px;
`;

function buildStyleProperty(cols) {
  for (let i = cols.length - 1; i >= 0; i--) {
    cols[i].width = cols[i].width ?? 150;
    cols[i].style = {
      flex: `1 0 ${cols[i].width}px`,
      width: `${cols[i].width}px`
    };
  }
  return cols;
}
function buildFixedProperty(cols) {
  let left = 0;
  for (let i = cols.length - 1; i >= 0; i--) {
    if (cols[i].fixed) {
      cols[i].fixedStyle = {
        backgroundColor: '#fff',
        position: 'sticky',
        flex: `0 0 ${cols[i].width}px`,
        right: `${left}px`
      };
    } else {
      cols[i].fixedStyle = {};
    }
    left += cols[i].width;
  }
  return cols;
}
function mapColsToKeys(cols) {
  return cols.reduce((acc, cur) => {
    acc[cur.accessor] = cur;
    return acc;
  }, {});
}

const TABLE_DEFAULTS = {
  fixedHeight: false,
  data: [],
  fixedHeightSize: 500,
  fluid: false,
  hasFilter: false,
  hasSort: false
};

const TableCell = React.memo(StyledTd);

const TableCellWrapper = ({ colsKey, column, columns, index, row }) => {
  const colInfo = React.useMemo(() => {
    return colsKey[column.accessor];
  }, [colsKey, column.accessor]);

  const cellValue = React.useMemo(() => getValue(row, column.accessor), [
    row,
    column.accessor
  ]);
  const cellProps = React.useMemo(() => {
    // ignore computation which we don't need
    if (!colInfo.Cell) {
      return null;
    }
    let data = {
      row: { original: row },
      column: colInfo,
      columns,
      value: cellValue
    };
    data.cell = {
      row: data.row,
      value: data.value
    };
    return data;
  }, [row, colInfo, columns, cellValue]);

  const cellContent = colInfo.Cell ? colInfo.Cell(cellProps) : cellValue;
  return (
    <TableCell
      key={`row-${index}-${column.accessor}`}
      className={colInfo.className || null}
      style={{ ...colInfo.style, ...colInfo.fixedStyle }}
    >
      {cellContent}
    </TableCell>
  );
};

export const Table = ({
  columns,
  data = TABLE_DEFAULTS.data,
  fixedHeight = TABLE_DEFAULTS.fixedHeight,
  fixedHeightSize = TABLE_DEFAULTS.fixedHeightSize,
  fluid = TABLE_DEFAULTS.fluid,
  hasSort = TABLE_DEFAULTS.hasSort,
  // onSort = defaultMethod,
  hasFilter = TABLE_DEFAULTS.hasFilter
}) => {
  // const hasFilter = TABLE_DEFAULTS.hasFilter;
  const cols = useMemo(() => buildFixedProperty(buildStyleProperty(columns)), [
    columns
  ]);
  const colsKey = useMemo(() => mapColsToKeys(cols), [cols]);
  const tableWidth = useMemo(
    () => cols.reduce((acc, curr) => acc + curr.width, 0),
    [cols]
  );
  const { filteredData, filters, onFilterChange, Filter } = useFilter({
    data,
    columns,
    hasFilter
  });

  const { sortedData, Sort } = useSort({
    data: filteredData,
    columns,
    hasSort
  });
  return (
    <TableWrapper>
      <StyledTable
        $fluid={fluid}
        $tableWidth={tableWidth}
        $height={fixedHeight && fixedHeightSize}
        className={'tps-table'}
      >
        <thead>
          <tr>
            {columns.map((c, index) => {
              let colInfo = colsKey[c.accessor];
              return (
                <StyledTh
                  key={`th-${index}`}
                  className={colInfo.className || null}
                  style={{ ...colInfo.style, ...colInfo.fixedStyle }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column'
                      // justifyContent: "space-between"
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{colInfo.Header}</span>
                      {hasSort && !colInfo.disableSortBy ? (
                        <Sort column={colInfo} />
                      ) : null}
                    </div>
                    {hasFilter && !colInfo.disableFilterBy ? (
                      <Filter
                        {...{
                          column: colInfo,
                          onChange: onFilterChange,
                          prefilteredRows: data
                        }}
                      />
                    ) : null}
                  </div>
                </StyledTh>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => {
            return (
              <tr key={`row-${index}`} className={row.className || null}>
                {columns.map(c => (
                  <TableCellWrapper
                    key={`row-cellWrapper-${index}-${c.accessor}`}
                    index={index}
                    column={c}
                    columns={columns}
                    colsKey={colsKey}
                    row={row}
                  />
                ))}
              </tr>
            );
          })}
        </tbody>
      </StyledTable>
    </TableWrapper>
  );
};

const columns = [
  {
    Header: 'column 1',
    accessor: 'col1',
    width: 120,
    filter: FILTER_TYPES.MATCH
  },
  {
    Header: 'column 2',
    accessor: 'col2',
    width: 120,
    Filter: SelectFilter,
    filter: FILTER_TYPES.MATCH
  },
  { Header: 'column 3', accessor: 'col3', width: 120, disableFilterBy: true },
  { Header: 'column 4', accessor: 'col4', width: 120, disableSortBy: true },
  { Header: 'column 5', accessor: 'col5', width: 120 },
  { Header: 'column 6', accessor: 'col6', width: 120, fixed: false },
  { Header: 'column 7', accessor: 'col7', width: 120, fixed: false },
  { Header: 'column 8', accessor: 'col8', width: 120, fixed: true }
];

let tableData = [
  { col1: '1', col2: 2, col3: 3, col4: 4, col5: 5, col6: 6, col7: 7, col8: 8 },
  { col1: '4', col2: 2, col3: 3, col4: 4, col5: 5, col6: 6, col7: 7, col8: 8 },
  { col1: '1', col2: 3, col3: 3, col4: 4, col5: 5, col6: 6, col7: 7, col8: 8 },
  {
    col1: 'hello10',
    col2: 7,
    col3: 3,
    col4: 4,
    col5: 5,
    col6: 6,
    col7: 7,
    col8: 8
  },
  {
    col1: 'hello9',
    col2: 44,
    col3: 3,
    col4: 4,
    col5: 5,
    col6: 6,
    col7: 7,
    col8: 8
  },
  {
    col1: '7535',
    col2: 24,
    col3: 3,
    col4: 4,
    col5: 5,
    col6: 6,
    col7: 7,
    col8: 8
  },
  {
    col1: '1678342',
    col2: 52,
    col3: 3,
    col4: 4,
    col5: 5,
    col6: 6,
    col7: 7,
    col8: 8
  },
  { col1: '9', col2: 2, col3: 3, col4: 4, col5: 5, col6: 6, col7: 7, col8: 8 }
];
export const TableDemo = () => {
  return (
    <Table columns={columns} data={tableData} hasFilter={true} hasSort={true} />
  );
};
