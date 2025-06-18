"use client";

import { InfoCard } from "@/components/dashboard/infoCard";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { PlanContent } from "@/components/dashboard/planContent";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { string2render } from "@/libs/stringRender";
import { Button, Chip, Modal, useDisclosure } from "@heroui/react";
import { useFormatter, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();
  const searchParams = useSearchParams();
  const { data, isLoading } = useSWR("user/plan/fetch");
  const { userInfo } = useAuth();

  const [period, setPeriod] = useState("month_price");
  const [plan, setPlan] = useState<PlanData | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fetchPlan = async (id: number) => {
    try {
      const { data } = await fetch.get(`user/plan/fetch?id=${id}`);
      return data.data;
    } catch (e) {
      errorHandle(e);
    }
  };

  const renderPlan = async (id: number, p?: string) => {
    if (!data || !data.data) return;
    if (!Array.isArray(data.data)) return;
    if (data.data.length === 0) return;
    let plan: PlanData = data.data.find((plan: PlanData) => plan.id === id);
    if (!plan) {
      plan = await fetchPlan(id);
      if (!plan) return;
    }
    if (p) {
      if (!plan[p as keyof PlanData]) return;
      setPeriod(p);
    } else {
      setPeriod(checkPeriod(plan));
    }
    setPlan(plan);
    onOpen();
  };

  useEffect(() => {
    if (!data || !data.data) return;
    if (searchParams.size > 0 && data.data) {
      const id = searchParams.get("id");
      if (!id) return;
      renderPlan(parseInt(id), searchParams.get("period") ?? undefined);
    }
  }, [searchParams, data]);

  const checkPeriod = (item: PlanData) => {
    if (item.month_price) return "month_price";
    if (item.quarter_price) return "quarter_price";
    if (item.half_year_price) return "half_year_price";
    if (item.year_price) return "year_price";
    if (item.two_year_price) return "two_year_price";
    if (item.three_year_price) return "three_year_price";
    if (item.onetime_price) return "onetime_price";
    return "reset_price";
  };
  const lowestPrice = (item: PlanData) => {
    const plan = checkPeriod(item);
    return (item[plan] ?? 0) / 100;
  };

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <NoticeCard />
      {!isLoading &&
        data &&
        data.data &&
        data.data.map((item: PlanData) => (
          <InfoCard
            key={item.id.toString()}
            icon=""
            title={
              <div className="w-full flex flex-col gap-4 text-start">
                <div className="flex flex-row justify-between items-center gap-2 w-full">
                  <span className="w-[70%] truncate">{item.name}</span>
                  {item.capacity_limit != null && item.capacity_limit <= 10 && (
                    <Chip
                      color={item.capacity_limit > 0 ? "warning" : "danger"}
                      className="text-sm text-white"
                      radius="sm"
                      size="sm"
                    >
                      {item.capacity_limit > 0
                        ? t("shopPlanLeft", { left: item.capacity_limit })
                        : t("shopPlanNoLeft")}
                    </Chip>
                  )}
                </div>
                <div className="text-medium text-default-500">
                  {t.rich("shopTrafficEnable", {
                    traffic: (chunks) => (
                      <span className="font-bold text-primary">
                        {item.transfer_enable} GB
                      </span>
                    ),
                  })}
                </div>
              </div>
            }
            endContent={
              <Button
                fullWidth
                isDisabled={
                  item.capacity_limit !== null && item.capacity_limit <= 0
                }
                onPress={() => {
                  renderPlan(item.id);
                }}
                radius="lg"
                color="primary"
              >
                {t("shopBuy")}
              </Button>
            }
          >
            <div className="flex flex-col gap-8 text-start text-sm min-h-24">
              <span className="text-md font-medium text-default-400 tracking-tight text-nowrap">
                {t.rich("shopPrice", {
                  price: () => (
                    <span className="text-foreground text-4xl font-bold tracking-tight truncate">
                      {format.number(lowestPrice(item), {
                        style: "currency",
                        currency: "CNY",
                      })}
                    </span>
                  ),
                  period: t(checkPeriod(item)),
                })}
              </span>
              {string2render(item.content)}
            </div>
          </InfoCard>
        ))}
      <Modal
        placement="center"
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
      >
        <PlanContent
          plan={plan}
          userInfo={userInfo}
          period={period}
          setPeriod={setPeriod}
        />
      </Modal>
    </div>
  );
}
