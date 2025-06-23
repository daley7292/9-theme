"use client";

import { LoadingInfoCard } from "@/components/dashboard/infoCard";
import { useFormatter, useTranslations } from "next-intl";
import useSWR from "swr";
import {
  Chip,
  cn,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/react";
import { filesize } from "filesize";
import { useCallback, useEffect, useState, useTransition } from "react";
import { Loader } from "@/components/loader";

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();
  const { data, isLoading } = useSWR("user/stat/getTrafficLog");
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(0);
  const rowsPerPage = 10;

  useEffect(() => {
    if (!data || !data.data) return;
    setPages(Math.ceil(data.data.length / rowsPerPage));
  }, [data, rowsPerPage]);

  useEffect(() => {
    if (!data || !data.data) return;
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    setTrafficData(data.data.slice(start, end));
  }, [data, page]);

  const renderDetailCell = useCallback(
    (item: TrafficData, columnKey: string) => {
      const cellValue = item[columnKey as keyof TrafficData];

      switch (columnKey) {
        case "u":
        case "d":
          return (
            <span className="text-xs">
              {filesize(cellValue, {
                standard: "jedec",
              })}
            </span>
          );
        case "server_rate":
          return (
            <Chip size="sm" variant="flat" color="primary" radius="sm">
              {cellValue} x
            </Chip>
          );
        case "record_at":
          return (
            <span className="text-xs">
              {format.dateTime(new Date((cellValue as number) * 1000), {
                year: "numeric",
                month: "numeric",
                day: "numeric",
              })}
            </span>
          );
        default:
          return cellValue;
      }
    },
    []
  );

  return (
    <div className="gap-4 p-6 md:px-12 flex flex-col">
      {isLoading ? (
        <LoadingInfoCard />
      ) : (
        <>
          {/* <InfoCard
            title="最近 7 天流量使用"
            icon="tabler:chart-bar"
            className="col-span-full"
          >
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={formatedData}
                accessibilityLayer
                margin={{ top: 24, bottom: 4 }}
                barSize={30}
              >
                <CartesianGrid
                  stroke="hsl(var(--heroui-default-200))"
                  strokeDasharray="3 3"
                  vertical={false}
                />
                <XAxis
                  axisLine={false}
                  dataKey="date"
                  style={{
                    fontSize: "var(--heroui-font-size-tiny)",
                  }}
                  tickLine={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => (
                    <Card radius="lg">
                      <CardHeader className="text-sm text-default-700">
                        {label}
                      </CardHeader>
                      <CardBody className="gap-2 text-sm">
                        {payload?.map((entry, index) => {
                          return (
                            <div
                              key={index}
                              className="flex flex-row gap-2 items-center"
                            >
                              <Chip size="sm" radius="sm" variant="flat">
                                {entry.name} x
                              </Chip>
                              <span className="text-default-500">
                                {filesize(entry.value as number, {
                                  standard: "jedec",
                                })}
                              </span>
                            </div>
                          );
                        })}
                      </CardBody>
                    </Card>
                  )}
                />
                <Legend />
                {serverRateList.map((rate, index) => (
                  <Bar
                    dataKey={rate}
                    stackId="a"
                    radius={[8, 8, 0, 0]}
                    fill={colorList[index]}
                    key={rate}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </InfoCard> */}
          <Table
            aria-label="dynamic content"
            isStriped
            isHeaderSticky
            className="col-span-full"
            classNames={{
              thead: "[&>tr]:first:shadow-none",
              th: "bg-content2",
            }}
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
              <TableColumn className="text-center" key="u">
                {t("logUpload")}
              </TableColumn>
              <TableColumn className="text-center" key="d">
                {t("logDownload")}
              </TableColumn>
              <TableColumn className="text-center" key="server_rate">
                {t("logRate")}
              </TableColumn>
              <TableColumn className="text-center" key="record_at">
                {t("logDate")}
              </TableColumn>
            </TableHeader>
            <TableBody
              items={trafficData}
              isLoading={isLoading}
              loadingContent={<Loader />}
              emptyContent={t("logEmpty")}
            >
              {(item: TrafficData) => (
                <TableRow key={item.record_at + item.server_rate}>
                  {(columnKey) => (
                    <TableCell className="text-center">
                      {renderDetailCell(item, columnKey.toString())}
                    </TableCell>
                  )}
                </TableRow>
              )}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
