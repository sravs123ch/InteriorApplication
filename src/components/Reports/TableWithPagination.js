// TableWithPagination.js
import React from 'react';
import TablePagination from '@mui/material/TablePagination';

const TableWithPagination = ({ columns, data, rowsPerPage, page, handleChangePage, handleChangeRowsPerPage }) => {
  return (
    <>
      <table className="min-w-full border-collapse border border-gray-300 mt-4">
        <thead className='bg-custom-maroon'>
          <tr className="text-center border-b border-gray-300">
            {columns.map((col, index) => (
              <th key={index} className="px-4 py-2 font-normal border-r border-gray-300">{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((row, index) => (
              <tr key={index} className="text-center border-b border-gray-300">
                {Object.values(row).map((value, i) => (
                  <td key={i} className="px-4 py-2 border-r border-gray-300">{value}</td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={data.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </>
  );
};

export default TableWithPagination;
