import {
  Button,
  cn,
  Modal,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";
import { Loader } from "../loader";
import { useFormatter, useTranslations } from "next-intl";
import * as rdd from "react-device-detect";
import { DeviceContent } from "./deviceContent";

export const DeviceList = () => {
  const t = useTranslations();
  const format = useFormatter();

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { data, isLoading, mutate } = useSWR("user/getActiveSession");
  const [activeSession, setActiveSession] = useState<ActiveSessionData[]>([]);
  const [filterSession, setFilterSession] = useState<ActiveSessionData[]>([]);

  useEffect(() => {
    if (!data || !data.data) return;
    const items = [];
    const keys = Object.keys(data.data);
    let index = 0;
    for (let i = keys.length - 1; i >= 0; i--) {
      const key = keys[i];
      items.push({ ...data.data[key], key, index });
      index++;
    }
    setActiveSession(items);
  }, [data]);

  useEffect(() => {
    if (!activeSession) return;
    setPages(Math.ceil(activeSession.length / rowsPerPage));
  }, [activeSession, rowsPerPage]);

  useEffect(() => {
    if (!activeSession) return;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setFilterSession(activeSession.slice(start, end));
  }, [activeSession, page, rowsPerPage]);

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const [sessionIndex, setSessionIndex] = useState(0);
  const renderDetailCell = useCallback(
    (item: ActiveSessionData, columnKey: string) => {
      const cellValue = item[columnKey as keyof ActiveSessionData];

      switch (columnKey) {
        // case "ip":
        //   return <span>{cellValue}</span>;
        case "login_at":
          const date = (cellValue as number) * 1000; // 将秒转换为毫秒
          return (
            <span className="text-xs">
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
        case "ua":
          const ua = rdd.getSelectorsByUserAgent(cellValue as string);
          return (
            <span className="text-xs">
              {ua.osName} {ua.browserName}
            </span>
          );
        case "action":
          return (
            <Button
              isIconOnly
              size="sm"
              color="danger"
              variant="light"
              isDisabled={item.index === 0}
              onPress={() => {
                onOpen();
                setSessionIndex(item.index);
              }}
            >
              <Icon icon="ri:delete-bin-line" width={16} />
            </Button>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <>
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
              {t("profileDevice")}
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
                variant="flat"
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
          <TableColumn className="text-center" key="ua">
            {t("profileDeviceName")}
          </TableColumn>
          <TableColumn className="text-center" key="login_at">
            {t("profileDeviceTime")}
          </TableColumn>
          <TableColumn className="text-center" key="action">
            {t("profileDeviceAction")}
          </TableColumn>
        </TableHeader>
        <TableBody
          items={filterSession}
          isLoading={isLoading}
          loadingContent={<Loader />}
          emptyContent={t("profileDeviceNo")}
        >
          {(item: ActiveSessionData) => (
            <TableRow key={item.key}>
              {(columnKey) => (
                <TableCell className="text-center">
                  {renderDetailCell(item, columnKey.toString())}
                </TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <DeviceContent
          mutate={mutate}
          session={activeSession[sessionIndex]}
          onClose={onClose}
        />
      </Modal>
    </>
  );
};
