/**
 * Bảng dữ liệu đơn giản, cuộn ngang trên màn hình nhỏ.
 * columns: [{ key, header, render?(row), className? }]
 */
export default function DataTable({ columns, rows, rowKey = 'id' }) {
  return (
    <div className="scrollbar-thin overflow-x-auto">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 bg-navy-50/60">
            {columns.map((c) => (
              <th key={c.key} scope="col" className={`px-4 py-3 text-xs font-semibold tracking-wide whitespace-nowrap text-navy-500 uppercase ${c.className ?? ''}`}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-navy-100">
          {rows.map((row) => (
            <tr key={row[rowKey]} className="transition-colors hover:bg-navy-50/50">
              {columns.map((c) => (
                <td key={c.key} className={`px-4 py-3 align-middle text-navy-700 ${c.className ?? ''}`}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
