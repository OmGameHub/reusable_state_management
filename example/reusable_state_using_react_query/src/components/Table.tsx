import React from "react";

import { classNames } from "@/utils/helperFunctions";
import { Spin } from "antd";

export interface ITableHeadingProps {
  key?: string | null;
  text: string | React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}

interface ITableProps {
  className?: string;
  containerClassName?: string;
  headClassName?: string;
  headRowClassName?: string;

  headers: (string | ITableHeadingProps | React.ReactNode)[];
  data: any[];
  renderRow: (rowData: any, index: number) => React.ReactNode;
  loading?: boolean;

  showPagination?: boolean;
  activePage?: number;
  totalItemsCount?: number;
  itemsCountPerPage?: number;
  onPageChange?: (currentPage: number) => void;
}

const Table: React.FC<ITableProps> = ({
  containerClassName,
  className,

  headClassName,
  headRowClassName,
  headers,

  data,
  renderRow,
  loading = false,

  // showPagination = false,
  // activePage = 1,
  // totalItemsCount = 0,
  // onPageChange,
  // itemsCountPerPage,
}) => {
  return (
    <>
      <div
        className={classNames(
          containerClassName,
          "max-w-full rounded-sm border border-stroke bg-white shadow-default"
        )}
      >
        <table className={classNames(className, "w-full table-auto")}>
          <thead className={classNames(headClassName)}>
            <tr
              className={classNames(
                headRowClassName,
                "bg-gray-100 dark:bg-blue-950 text-left"
              )}
            >
              {headers.map((header, index) =>
                typeof header === "string" ? (
                  <th
                    key={index}
                    className="p-4 font-medium text-black dark:text-white"
                  >
                    {header}
                  </th>
                ) : header && typeof header === "object" && "text" in header ? (
                  <th
                    key={index}
                    style={header.style}
                    className={classNames(
                      header.className,
                      "p-4 font-medium text-black dark:text-white"
                    )}
                  >
                    {header.text}
                  </th>
                ) : (
                  header
                )
              )}
            </tr>
          </thead>

          <tbody>{data.map(renderRow)}</tbody>
        </table>
      </div>

      {/* {!loading && data.length === 0 && (
        <div className="bg-white border-[#eee] p-4 dark:border-strokedark text-center">
          No data found
        </div>
      )} */}

      {loading && (
        <div className="flex items-center justify-center bg-white">
          <Spin className="p-5" />
        </div>
      )}
    </>
  );
};

export default Table;
