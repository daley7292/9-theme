import {
  cn,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Loader } from "../loader";
import { useFormatter, useTranslations } from "next-intl";

export const InviteList = () => {
  const t = useTranslations();
  const format = useFormatter();

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data: detail, isLoading: isDetailLoading } = useSWR(
    `user/invite/details?current=${page}&page_size=${rowsPerPage}`
  );

  useEffect(() => {
    if (!detail || !detail.total) return;
    setPages(Math.ceil(detail.total / rowsPerPage));
  }, [detail, rowsPerPage]);

  const renderDetailCell = useCallback(
    (item: CommissionItemData, columnKey: string) => {
      const cellValue = item[columnKey as keyof CommissionItemData];

      switch (columnKey) {
        case "created_at":
          const date = (cellValue as number) * 1000; // 将秒转换为毫秒
          return (
            <span className="text-left text-default-500">
              {format.dateTime(date, {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
              })}
            </span>
          );
        case "get_amount":
          return (
            <div className="text-right">
              {format.number((cellValue as number) / 100, {
                style: "currency",
                currency: "CNY",
              })}
            </div>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <Table
      aria-label="dynamic content"
      isStriped
      isHeaderSticky
      className="col-span-full"
      classNames={{
        thead: "[&>tr]:first:shadow-none",
        th: "bg-content2",
      }}
      topContent={
        <div className="flex flex-row justify-between items-center p-2 relative">
          <span className="text-lg font-bold tracking-wider text-default-700">
            {t("inviteHistory")}
          </span>
          <label className="flex-1 flex justify-end items-start text-default-400 text-small">
            {t("inviteHistoryRows")}
            <select
              className="outline-none text-default-400 text-small"
              onChange={(e) => {
                setRowsPerPage(Number(e.target.value));
                setPage(1);
              }}
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      }
      bottomContent={
        pages > 1 && (
          <div className="flex justify-center">
            <Pagination
              isCompact
              showControls
              showShadow
              color="primary"
              page={page}
              total={pages}
              onChange={(value) => {
                if (value && value != page) {
                  setPage(value);
                }
              }}
            />
          </div>
        )
      }
    >
      <TableHeader>
        <TableColumn className="text-left" key="created_at">
          {t("inviteHistoryCreateAt")}
        </TableColumn>
        <TableColumn className="text-right" key="get_amount">
          {t("inviteHistoryAmount")}
        </TableColumn>
      </TableHeader>
      <TableBody
        items={detail?.data ?? []}
        isLoading={isDetailLoading}
        loadingContent={<Loader />}
        emptyContent={t("inviteHistoryNo")}
      >
        {(item: CommissionItemData) => (
          <TableRow key={item.id.toString()}>
            {(columnKey) => (
              <TableCell
                className={
                  columnKey == "created_at" ? "text-left" : "text-right"
                }
              >
                {renderDetailCell(item, columnKey.toString())}
              </TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};
