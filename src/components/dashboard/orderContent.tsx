import {
  Button,
  cn,
  Divider,
  Image,
  Link,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  ScrollShadow,
  Spacer,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import CellValue from "../cell-value";
import { Loader } from "../loader";
import { useCallback, useEffect, useState, useTransition } from "react";
import { useFormatter, useTranslations } from "next-intl";
import { fetch } from "@/libs/request";
import errorHandle from "@/libs/errorHandler";
import { useRouter } from "next/navigation";

export const OrderContent = ({
  order,
  payment,
  mutate,
  onClose,
}: {
  order: OrderData | null;
  payment: PaymentData[] | null;
  mutate: () => Promise<any>;
  onClose: () => void;
}) => {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();

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

  const [selected, setSelected] = useState("");
  useEffect(() => {
    if (!payment) return;
    if (!Array.isArray(payment)) return;
    if (payment.length === 0) return;
    setSelected(payment[0].id.toString());
  }, [payment]);
  const [isClosing, startClosing] = useTransition();
  const onClosing = () => {
    startClosing(async () => {
      if (!order) return;
      try {
        await fetch.post(`user/order/cancel`, {
          trade_no: order.trade_no,
        });
        await mutate();
        onClose();
      } catch (e) {
        errorHandle(e);
      }
    });
  };

  const [isCheckout, startCheckout] = useTransition();
  const onCheckout = () => {
    startCheckout(async () => {
      if (!order) return;
      try {
        const response = await fetch.post(`user/order/checkout`, {
          trade_no: order.trade_no,
          method: selected,
        });
        if (typeof response.data.data === "string") {
          router.push(response.data.data);
        } else {
          // refresh order
          window.location.reload();
        }
      } catch (e) {
        errorHandle(e);
      }
    });
  };

  return (
    <ModalContent>
      {() =>
        order ? (
          <ScrollShadow>
            <ModalHeader>{t("orderTitle")}</ModalHeader>
            <ModalBody className="mb-2">
              <div
                className={cn(
                  "flex flex-col justify-center items-center gap-2",
                  "rounded-lg min-h-24",
                  "border-1",
                  "border-" + statusMap(order.status).color + "-200",
                  "bg-" + statusMap(order.status).color + "-100",
                  "text-" + statusMap(order.status).color + "-500"
                )}
              >
                <Icon icon={statusMap(order.status).icon} width={24} />
                {t("orderStatus." + order.status)}
              </div>
              <Spacer y={1} />
              <div className="flex flex-col">
                <CellValue label={t("orderTradeno")} value={order.trade_no} />
                <CellValue label={t("orderPlanName")} value={order.plan.name} />
                <CellValue label={t("orderPlanType")} value={t(order.period)} />
                <CellValue
                  label={t("orderPlanTraffic")}
                  value={`${order.plan.transfer_enable} GB`}
                />
                <CellValue
                  label={t("orderPrice")}
                  value={format.number(
                    (order.plan[order.period as keyof PlanData] as number) /
                      100,
                    { style: "currency", currency: "CNY" }
                  )}
                />
                {order.status === 3 && (
                  <CellValue
                    label={t("orderTotal")}
                    value={format.number((order.total_amount ?? 0) / 100, {
                      style: "currency",
                      currency: "CNY",
                    })}
                  />
                )}
              </div>
              <div className="flex flex-col">
                {order.balance_amount ? (
                  <CellValue
                    label={t("orderBalanceUsed")}
                    value={format.number((order.balance_amount ?? 0) / 100, {
                      style: "currency",
                      currency: "CNY",
                    })}
                  />
                ) : null}
                {order.surplus_amount ? (
                  <CellValue
                    label={t("orderOldPlanUsed")}
                    value={format.number((order.surplus_amount ?? 0) / 100, {
                      style: "currency",
                      currency: "CNY",
                    })}
                  />
                ) : null}
                {order.refund_amount ? (
                  <CellValue
                    label={t("orderRefund")}
                    value={format.number((order.refund_amount ?? 0) / 100, {
                      style: "currency",
                      currency: "CNY",
                    })}
                  />
                ) : null}
              </div>
              {order.status === 0 && (order.total_amount ?? 0) > 0 && (
                <>
                  <span className="text-sm text-default-500">
                    {t("paymentMethod")}
                  </span>
                  <RadioGroup value={selected} onValueChange={setSelected}>
                    {payment &&
                      Array.isArray(payment) &&
                      payment.map((item: PaymentData) => (
                        <Radio
                          classNames={{
                            base: cn(
                              "inline-flex m-0 bg-content1 hover:bg-content2 items-center justify-between",
                              "flex max-w-full cursor-pointer rounded-lg gap-4 py-4 border-2",
                              "data-[selected=true]:border-primary data-[selected=true]:bg-primary-50",
                              "transition-transform duration-300 hover:scale-105 tracking-wider",
                              "rounded-large"
                            ),
                            wrapper: "hidden",
                            label:
                              "flex items-center justify-start w-full gap-2 text-default-500",
                          }}
                          key={item.id.toString()}
                          value={item.id.toString()}
                        >
                          <div className="min-w-[24px] min-h-[24px]">
                            {item.icon ? (
                              <Image
                                alt=""
                                width={24}
                                height={24}
                                radius="none"
                                src={item.icon}
                              />
                            ) : (
                              <Icon icon="ri:bank-card-line" width={24} />
                            )}
                          </div>
                          <span className="text-md font-bold text-default-700 tracking-wider">
                            {item.name}
                          </span>
                        </Radio>
                      ))}
                  </RadioGroup>
                </>
              )}
            </ModalBody>
            {order.status === 0 && (
              <ModalFooter className="justify-between items-center">
                <p className="text-lg font-bold">
                  {t("orderDetailTotal", {
                    total: format.number((order.total_amount ?? 0) / 100, {
                      style: "currency",
                      currency: "CNY",
                    }),
                  })}
                </p>
                <div className="flex gap-2">
                  <Button
                    radius="lg"
                    variant="light"
                    color="danger"
                    isLoading={isClosing}
                    isDisabled={isCheckout}
                    onPress={onClosing}
                    className="transition-transform duration-300 hover:scale-105 tracking-wider"
                  >
                    {!isClosing && t("orderClose")}
                  </Button>
                  <Button
                    radius="lg"
                    isLoading={isCheckout}
                    isDisabled={isClosing}
                    onPress={onCheckout}
                    color="primary"
                    className="transition-transform duration-300 hover:scale-105 tracking-wider"
                  >
                    {!isCheckout && t("orderCheck")}
                  </Button>
                </div>
              </ModalFooter>
            )}
            {order.status === 3 && (
              <ModalFooter className="flex flex-col gap-2 border-t-1 border-default-200">
                <span className="text-md leading-6">{t("orderTutorial1")}</span>
                <span className="text-sm text-default-500">
                  {t("orderTutorial2")}
                </span>
                <span className="text-sm text-default-500">
                  {t("orderTutorial3")}
                </span>
                <Link
                  href="/dashboard/knowledge"
                  className="font-semibold"
                  color="primary"
                  size="sm"
                >
                  {t("orderTutorial4")}
                  <span aria-hidden="true"> &rarr;</span>
                </Link>
              </ModalFooter>
            )}
          </ScrollShadow>
        ) : (
          <div className="w-full h-[100px] flex justify-center items-center">
            <Loader />
          </div>
        )
      }
    </ModalContent>
  );
};
