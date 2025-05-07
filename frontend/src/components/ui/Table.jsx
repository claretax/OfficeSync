import React from "react";

function Table({ columns, data, noDataMessage }) {
  return (
    <div className="overflow-x-auto max-h-96 shadow-lg">
      <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-red-300 text-white">
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} className="text-left p-2 uppercase font-semibold">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-200 hover:bg-gray-100">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="p-2">
                    {col.accessor(row)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="text-center p-2 text-gray-500">
                {noDataMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
