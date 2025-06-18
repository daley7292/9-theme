"use client";

import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { OrderContent } from "@/components/dashboard/orderContent";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { Button, Chip, cn, Modal, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback, useEffect, useState } from "react";
import useSWR from "swr";

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();
  const { data, isLoading, mutate } = useSWR("user/order/fetch");
  const { data: payment } = useSWR("user/order/getPaymentMethod");

  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [order, setOrder] = useState<OrderData | null>(null);
  const renderOrder = async (order: OrderData) => {
    try {
      setOrder(null);
      onOpen();
      const res = await fetch.get(
        `user/order/detail?trade_no=${order.trade_no}`
      );
      setOrder(res.data.data);
    } catch (e) {
      errorHandle(e);
    }
  };

  useEffect(() => {
    if (!data || !data.data) return;
    if (!Array.isArray(data.data)) return;
    if (data.data.length === 0) return;
    const order: OrderData = data.data[0];
    if (order.status === 0) {
      renderOrder(order);
    }
  }, [data]);

  useEffect(() => {
    if (!order) return;
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    if (order.status === 0 && isOpen) {
      setTimer(
        setInterval(async () => {
          const { data } = await fetch.get(
            `user/order/check?trade_no=${order.trade_no}`
          );
          if (data.data !== 0) {
            window.location.reload();
          }
        }, 5000)
      );
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [order, isOpen]);

  const [timer, setTimer] = useState<ReturnType<typeof setInterval> | null>(
    null
  );

  const statusMap = useCallback((status: number) => {
    switch (status) {
      case 0:
        return {
          color: "warning",
          icon: "tabler:report",
        };
      case 1:
        return {
          color: "warning",
          icon: "tabler:report-money",
        };
      case 2:
        return {
          color: "default",
          icon: "tabler:clipboard-x",
        };
      case 3:
        return {
          color: "success",
          icon: "tabler:checkup-list",
        };
      case 4:
        return {
          color: "secondary",
          icon: "tabler:coin",
        };
      default:
        return {
          color: "default",
          icon: "tabler:question-mark",
        };
    }
  }, []);

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <NoticeCard />
      {isLoading ? (
        <LoadingInfoCard />
      ) : (
        data &&
        data.data &&
        Array.isArray(data.data) &&
        data.data.map((order: OrderData) => (
          <InfoCard
            key={order.trade_no}
            title={order.plan?.name ?? " "}
            icon=""
            endContent={
              <div className="flex flex-row gap-2">
                <Chip
                  size="lg"
                  variant="dot"
                  color={statusMap(order.status).color as Color}
                  radius="sm"
                  className={cn(
                    "border-1",
                    "border-" + statusMap(order.status).color + "-200",
                    "bg-" + statusMap(order.status).color + "-100",
                    "text-" + statusMap(order.status).color + "-500"
                  )}
                  classNames={{
                    content: "text-xs",
                  }}
                >
                  {t("orderStatus." + order.status)}
                </Chip>
                <Button
                  size="sm"
                  variant="flat"
                  color="primary"
                  startContent={<Icon icon="ri:error-warning-line" />}
                  onPress={async () => renderOrder(order)}
                  className="transition-transform duration-300 hover:scale-105 tracking-wider"
                >
                  {t("dashboardNoticeDetail")}
                </Button>
              </div>
            }
          >
            <div className="flex flex-row gap-2">
              <Chip size="sm" variant="flat" radius="sm" color="primary">
                {format.number((order.total_amount ?? 0) / 100, {
                  style: "currency",
                  currency: "CNY",
                })}
              </Chip>
              <Chip
                size="sm"
                variant="faded"
                radius="sm"
                className="border border-primary-100 text-primary-400"
              >
                {t(order.period)}
              </Chip>
              <Chip
                size="sm"
                variant="faded"
                radius="sm"
                className="border border-primary-100 text-primary-400"
              >
                {format.dateTime(order.updated_at * 1000, {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </Chip>
            </div>
          </InfoCard>
        ))
      )}
      <Modal
        placement="center"
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{
          closeButton: "top-3.5 right-3.5",
        }}
      >
        <OrderContent
          order={order}
          payment={payment && payment.data}
          mutate={mutate}
          onClose={onClose}
        />
      </Modal>
    </div>
  );
}
