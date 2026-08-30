import React from 'react';
import * as ReactTable from '@tanstack/react-table';
import { createColumnHelper } from '@tanstack/react-table';

type Person = {
  id: string;
  name: string;
  age: number;
  email?: string;
};

const columnHelper = createColumnHelper<Person>();

const columns: ReactTable.ColumnDef<Person, any>[] = [
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info: ReactTable.CellContext<Person, any>) => <span>{String(info.getValue())}</span>,
  }),
  columnHelper.accessor('age', {
    header: 'Age',
    cell: (info: ReactTable.CellContext<Person, any>) => <span>{String(info.getValue())}</span>,
  }),
  columnHelper.accessor('email', {
    header: 'Email',
    cell: (info: ReactTable.CellContext<Person, any>) => <span>{String(info.getValue() ?? '')}</span>,
  }),
];

const data: Person[] = [
  { id: '1', name: 'Alice', age: 30, email: 'alice@example.com' },
  { id: '2', name: 'Bob', age: 25, email: 'bob@example.com' },
];

export default function DemoTable(): JSX.Element {
  const table = ReactTable.useReactTable<Person>({
    data,
    columns,
    getCoreRowModel: ReactTable.createCoreRowModel(),
    getFilteredRowModel: ReactTable.createFilteredRowModel(),
    getPaginationRowModel: ReactTable.createPaginationRowModel(),
    getSortedRowModel: ReactTable.createSortedRowModel(),
    sortingFns: ReactTable.sortFns,
  });

  return (
    <div className="overflow-auto">
      <table className="min-w-full">
        <thead>
          {table.getHeaderGroups().map((hg: ReactTable.HeaderGroup<Person>) => (
            <tr key={hg.id}>
              {hg.headers.map((header: ReactTable.Header<Person, any>) => (
                <th key={header.id} className="text-left p-2">
                  {header.isPlaceholder
                    ? null
                    : ReactTable.flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row: ReactTable.Row<Person, unknown>) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell: ReactTable.Cell<Person, any>) => (
                <td key={cell.id} className="p-2">
                  {ReactTable.flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Example: reading/setting a column filter safely */}
      <div className="mt-4">
        {table.getAllColumns().map((col) => {
          // column core type may not expose getFilterValue/setFilterValue on all column types,
          // so use optional chaining and safe checks.
          const current = (col as any).getFilterValue?.();
          return (
            <div key={col.id} className="mb-2">
              <strong>{col.id}</strong>: {String(current ?? '')}
            </div>
          );
        })}
      </div>
    </div>
  );
}
