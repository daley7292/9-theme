"use client";

import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { Modal, useDisclosure } from "@heroui/react";
import { useState } from "react";
import useSWR from "swr";
import { PlanCard } from "./planCard";
import { Content } from "./content";
import { useTranslations } from "next-intl";

const Page = () => {
  const t = useTranslations();
  const { data, isLoading } = useSWR("shop/plan/fetch");
  const { data: payment } = useSWR("shop/getPaymentMethod");

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [plan, setPlan] = useState<PlanData | null>(null);

  const fetchPlan = async (id: number) => {
    try {
      const { data } = await fetch.get(`user/plan/fetch?id=${id}`);
      return data.data;
    } catch (e) {
      errorHandle(e);
    }
  };
  const renderPlan = async (id: number) => {
    if (!data || !data.data) return;
    if (!Array.isArray(data.data)) return;
    if (data.data.length === 0) return;
    let plan: PlanData = data.data.find((plan: PlanData) => plan.id === id);
    if (!plan) {
      plan = await fetchPlan(id);
      if (!plan) return;
    }
    setPlan(plan);
    onOpen();
  };

  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center w-full">
        <div className="p-4 flex flex-col sm:w-2/3 h-auto text-center gap-6">
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t("shopTitle")}
          </h1>
          <h2 className="text-md sm:text-lg font-semibold text-default-500">
            {t("shopDesc")}
          </h2>
        </div>
        {!isLoading && data && data.data && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.data.map((item: PlanData) => (
              <PlanCard
                key={item.id.toString()}
                item={item}
                onPress={() => renderPlan(item.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Modal
        placement="center"
        isKeyboardDismissDisabled
        isDismissable={false}
        hideCloseButton
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        radius="lg"
        size="4xl"
        className="max-h-[90vh] w-full"
      >
        {plan && <Content plan={plan} payment={payment.data} />}
      </Modal>
    </>
  );
};

export default Page;
