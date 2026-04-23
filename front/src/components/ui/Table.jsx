export const Table = ({ children, className = "" }) => {
  return (
    <div className="w-full max-w-full overflow-x-auto min-w-0">
      <table className={`min-w-max text-sm ${className}`}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children }) => {
  return (
    <thead className="text-left border-b border-gray-200 text-gray-500 text-xs uppercase">
      {children}
    </thead>
  );
};

export const TableBody = ({ children }) => {
  return (
    <tbody className="divide-y divide-gray-100">
      {children}
    </tbody>
  );
};

export const TableRow = ({ children , className}) => {
  return (
    <tr className={`${className} hover:bg-gray-50 transition`}>
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = "" }) => {
  return (
    <td className={`px-3 py-3 ${className}`}>
      {children}
    </td>
  );
};

export const TableHeaderCell = ({ children, className = "" }) => {
  return (
    <th className={`px-3 py-3 font-medium ${className}`}>
      {children}
    </th>
  );
};

