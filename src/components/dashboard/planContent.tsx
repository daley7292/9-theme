import {
  Button,
  Form,
  Input,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ScrollShadow,
  Tab,
  Tabs,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import CellValue from "../cell-value";
import { useMemo, useState, useTransition } from "react";
import { fetch } from "@/libs/request";
import errorHandle from "@/libs/errorHandler";
import { useFormatter, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

const periodList = [
  "month_price",
  "quarter_price",
  "half_year_price",
  "year_price",
  "two_year_price",
  "three_year_price",
  "onetime_price",
  "reset_price",
];

export const PlanContent = ({
  plan,
  userInfo,
  period,
  setPeriod,
}: {
  plan: PlanData | null;
  userInfo: UserInfo | null;
  period: string;
  setPeriod: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const t = useTranslations();
  const format = useFormatter();
  const router = useRouter();

  const [coupon, setCoupon] = useState<CouponData | null>(null);
  const [isChecking, startChecking] = useTransition();
  const checkCoupon = (e: React.FormEvent<HTMLFormElement>) => {
    // Prevent default browser page refresh.
    e.preventDefault();

    // Get form data as an object.
    const formData = Object.fromEntries(new FormData(e.currentTarget));

    startChecking(async () => {
      if (!formData.coupon) return;
      try {
        const response = await fetch.post(`user/coupon/check`, {
          code: formData.coupon,
          plan_id: plan!.id,
        });
        const couponData = response.data.data as CouponData;
        if (couponData.limit_period && !couponData.limit_period.includes(period)) {
          throw Error(t("couponCodeInvalid"));
        }
        setCoupon(response.data.data);
      } catch (e) {
        setCoupon(null);
        errorHandle(e);
      }
    });
  };

  const [isCheckout, startCheckout] = useTransition();
  const onCheckout = () => {
    startCheckout(async () => {
      try {
        await fetch.post(`user/order/save`, {
          period,
          plan_id: plan!.id,
          coupon_code: coupon?.code,
        });
      } catch (e) {
        errorHandle(e);
      } finally {
        router.push("/dashboard/order");
      }
    });
  };

  const getPrice = useMemo(() => {
    if (!plan) return 0;
    const value = plan[period as keyof PlanData];
    if (!value) return 0;
    return value as number;
  }, [plan, period]);

  const getCouponPrice = useMemo(() => {
    if (!coupon) return 0;
    if (!getPrice) return 0;
    if (coupon.type === 1) {
      return getPrice - coupon.value < 0 ? 0 : getPrice - coupon.value;
    } else {
      return getPrice * (1 - coupon.value / 100);
    }
  }, [coupon, getPrice]);

  return (
    <ModalContent>
      {(onClose) =>
        plan && (
          <ScrollShadow>
            <ModalHeader>{t("shopPlanTitle", { plan: plan.name })}</ModalHeader>
            <ModalBody>
              {userInfo?.plan_id !== plan.id ? (
                <div className="rounded-lg bg-danger-50 p-4">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <Icon
                        icon="ri:alert-line"
                        className="h-6 w-6 text-danger-800"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-danger-800">
                        {t("planNoticeChange")}
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg bg-warning-50 p-4">
                  <div className="flex items-center">
                    <div className="shrink-0">
                      <Icon
                        icon="ri:alert-line"
                        className="h-6 w-6 text-warning-800"
                      />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-warning-800">
                        {t("planNoticeRenew")}
                      </h3>
                    </div>
                  </div>
                </div>
              )}
              <CellValue
                label={t("planTraffic")}
                value={plan.transfer_enable + " GB"}
              />
              <div className="flex flex-col gap-2">
                <span className="text-small text-default-500">
                  {t("planType")}
                </span>
                <Tabs
                  fullWidth
                  size="sm"
                  color="primary"
                  variant="bordered"
                  classNames={{
                    tabList: "border-primary/25",
                  }}
                  selectedKey={period}
                  onSelectionChange={(key) => setPeriod(key as string)}
                >
                  {period === "reset_price" ? (
                    <Tab key="reset_price" title={t("reset_price")} />
                  ) : (
                    periodList
                      .filter((key) => plan[key as keyof PlanData] !== null)
                      .map((value) =>
                        value === "reset_price" ? null : (
                          <Tab key={value} title={t(value)} />
                        )
                      )
                  )}
                </Tabs>
              </div>
              <Form
                className="flex flex-row items-end gap-2"
                onSubmit={checkCoupon}
              >
                <Input
                  name="coupon"
                  fullWidth
                  size="sm"
                  radius="md"
                  variant="bordered"
                  label={t("couponCode")}
                  labelPlacement="outside"
                  placeholder={t("couponCodePlaceholder")}
                  classNames={{
                    label:
                      "group-data-[filled-within=true]:text-default-500 text-sm",
                    input:
                      "placeholder:text-foreground-700 placeholder:text-tiny",
                    inputWrapper:
                      "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
                    helperWrapper: "h-4",
                  }}
                />
                <Button
                  radius="md"
                  color="primary"
                  variant="flat"
                  size="sm"
                  type="submit"
                  isLoading={isChecking}
                  className="transition-transform duration-300 hover:scale-105 tracking-wider"
                >
                  {!isChecking && t("couponCodeApply")}
                </Button>
              </Form>
              <CellValue
                label={t("planPrice")}
                value={
                  coupon &&
                  (!coupon.limit_period ||
                    coupon.limit_period.some((value) => value === period)) ? (
                    <>
                      <del>
                        {format.number(getPrice / 100, {
                          style: "currency",
                          currency: "CNY",
                        })}
                      </del>{" "}
                      <span className="text-danger">
                        {format.number(getCouponPrice / 100, {
                          style: "currency",
                          currency: "CNY",
                        })}
                      </span>
                    </>
                  ) : (
                    format.number(getPrice / 100, {
                      style: "currency",
                      currency: "CNY",
                    })
                  )
                }
              />
            </ModalBody>
            <ModalFooter>
              <Button
                variant="light"
                color="danger"
                isDisabled={isCheckout}
                onPress={onClose}
                className="transition-transform duration-300 hover:scale-105 tracking-wider"
              >
                {t("orderCancel")}
              </Button>
              <Button
                isLoading={isCheckout}
                onPress={onCheckout}
                color="primary"
                className="transition-transform duration-300 hover:scale-105 tracking-wider"
              >
                {!isCheckout && t("orderPay")}
              </Button>
            </ModalFooter>
          </ScrollShadow>
        )
      }
    </ModalContent>
  );
};
