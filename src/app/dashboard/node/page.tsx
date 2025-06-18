"use client";

import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { Chip, cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import useSWR from "swr";

export default function Page() {
  const t = useTranslations();
  const { data, isLoading } = useSWR<{ data: NodeData[] }>("user/server/fetch");

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
      <NoticeCard />
      {isLoading ? (
        <LoadingInfoCard />
      ) : data && data.data && data.data.length > 0 ? (
        data.data.map((node) => (
          <InfoCard
            key={node.id}
            icon=""
            title={node.name}
            endContent={
              <div className="flex flex-row gap-2 overflow-hidden">
                {node.tags &&
                  node.tags.map((tag) => (
                    <Chip key={tag} radius="sm" variant="flat" color="primary">
                      {tag}
                    </Chip>
                  ))}
              </div>
            }
          >
            <div className="flex flex-row gap-2 overflow-hidden">
              <Chip
                radius="sm"
                variant="dot"
                color={node.is_online === 0 ? "danger" : "success"}
                classNames={{
                  base: cn(
                    "border-" +
                      (node.is_online === 0 ? "danger" : "success") +
                      "-200"
                  ),
                  content: cn(
                    "text-" +
                      (node.is_online === 0 ? "danger" : "success") +
                      "-500"
                  ),
                }}
              >
                {node.is_online ? t("nodeOnline") : t("nodeOffline")}
              </Chip>
              <Chip radius="sm" variant="flat">
                {node.rate} x {t("nodeRate")}
              </Chip>
            </div>
          </InfoCard>
        ))
      ) : (
        <InfoCard className="col-span-full" icon="" title="">
          <div
            className={cn(
              "shadow-none",
              "flex flex-col gap-4 p-8",
              "items-center justify-center"
            )}
          >
            <Icon
              icon="ri:alert-line"
              width="128"
              height="128"
              className="text-warning"
            />
            <p className="text-lg font-bold text-center">{t("nodeNo")}</p>
          </div>
        </InfoCard>
      )}
    </div>
  );
}
