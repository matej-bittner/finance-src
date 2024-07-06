"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useColumns } from "@/app/[locale]/(protected)/dashboard/transactions/columns";
import { PeriodicPaymentData, TransactionData } from "@/types";
import { useColumnsPeriodicPayments } from "@/app/[locale]/(protected)/dashboard/transactions/columnsPeriodicPayments";
import { useTranslations } from "next-intl";

type ColumnData = TransactionData | PeriodicPaymentData | any;
// interface DataTableProps<TData, TValue> {
interface DataTableProps {
  // columns: ColumnDef<TData, TValue>[];
  // data: TData[];
  data: ColumnData[];
  title?: string;
  type: number;
  full_width?: boolean;
  row_limit?: number;
}
export function DataTable({
  // export function DataTable<TData, TValue>({
  title,
  // columns,
  data,
  full_width,
  row_limit,
  type,
  // }: DataTableProps<TData, TValue>) {
}: DataTableProps) {
  const transactionColumns = useColumns() as ColumnDef<ColumnData>[];
  const periodicPaymentColumns =
    useColumnsPeriodicPayments() as ColumnDef<ColumnData>[];

  const defaultColumns: ColumnDef<ColumnData>[] = [];
  const finalColumns: ColumnDef<ColumnData>[] =
    type === 1 ? transactionColumns : periodicPaymentColumns || defaultColumns;

  const table = useReactTable({
    data,
    // @ts-ignore
    columns: finalColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        // pageIndex: 1, //custom initial page index
        pageSize: row_limit || 5, //custom default page size
      },
    },
  });
  const t = useTranslations("data-table");
  return (
    <div
      className={`px-2 overflow-auto w-full  ${!full_width && "2xl:max-w-[720px]"}`}
    >
      {title && <h2 className="max-tb:text-center pb-1 2xl:pb-6">{title}</h2>}
      <Table style={{ borderCollapse: "separate", borderSpacing: "0px 5px" }}>
        <TableHeader className="bg-main-gray ">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="border-none ">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className="font-medium text-black h-fit py-1 first:rounded-l-2xl last:rounded-r-2xl max-sm:[&:nth-child(2)]:hidden max-sm:px-1"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
                className="border-none "
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="bg-main-gray first:rounded-l-2xl last:rounded-r-2xl h-fit  py-2 max-sm:[&:nth-child(2)]:hidden max-sm:px-1"
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={finalColumns.length}
                className="h-24 text-center"
              >
                {/*<TableCell colSpan={columns.length} className="h-24 text-center">*/}
                {t(`no-result`)}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {table.getCanPreviousPage() || table.getCanNextPage() ? (
        <div className="flex justify-between px-2 text-sm pt-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="font-medium underline underline-offset-2 disabled:text-black/40"
          >
            {t(`previous`)}
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="font-medium underline underline-offset-2 disabled:text-black/40"
          >
            {t(`next`)}
          </button>
        </div>
      ) : null}
    </div>
  );
}
