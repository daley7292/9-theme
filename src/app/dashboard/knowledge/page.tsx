"use client";

import { Card, cn, Modal, useDisclosure } from "@heroui/react";
import { useFormatter, useTranslations } from "next-intl";
import { useState } from "react";
import useSWR from "swr";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { Icon } from "@iconify/react/dist/iconify.js";
import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { KnowledgeContent } from "@/components/dashboard/knowledgeContent";
import { NoticeCard } from "@/components/dashboard/noticeCard";

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();

  const { data, isLoading } = useSWR<{ data: KnowledgeCategoryData }>(
    `user/knowledge/fetch?language=zh-CN`
  );

  const [info, setInfo] = useState<KnowledgeDetailData | null>(null);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleOpen = async (id: number) => {
    try {
      setInfo(null);
      onOpen();
      const res = await fetch.get(
        `user/knowledge/fetch?language=zh-CN&id=${id}`
      );
      setInfo(res.data.data);
    } catch (e) {
      errorHandle(e);
    }
  };

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <NoticeCard />
      {isLoading ? (
        <LoadingInfoCard />
      ) : (
        data &&
        Object.keys(data.data).map((key) => (
          <InfoCard icon="" key={key} title={key}>
            <div
              className={cn(
                "w-full h-full",
                "flex flex-col gap-y-2 justify-start items-start"
              )}
            >
              {data.data[key].map((item: KnowledgeData) => (
                <Card
                  key={item.id}
                  className={cn(
                    "flex flex-col gap-y-1 p-4 justify-start items-start",
                    "shadow-none bg-content2 data-[hover=true]:bg-content3",
                    "w-full tracking-wider z-10 text-start"
                  )}
                  radius="sm"
                  isHoverable
                  isPressable
                  onPress={() => {
                    handleOpen(item.id);
                  }}
                >
                  <span className="text-md font-semibold mb-2 w-[90%] truncate">
                    {item.title}
                  </span>
                  <span className="text-sm text-gray-500">
                    {t("updateAt", {
                      date: format.dateTime(item.updated_at * 1000, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      }),
                    })}
                  </span>
                  <span className="absolute text-default-500 right-4 top-4">
                    <Icon icon="ri:arrow-right-up-line" width={36} />
                  </span>
                </Card>
              ))}
            </div>
          </InfoCard>
        ))
      )}
      <Modal
        placement="center"
        isOpen={isOpen}
        size="4xl"
        scrollBehavior="inside"
        onOpenChange={onOpenChange}
        classNames={{
          closeButton: "top-3.5 right-3.5",
        }}
      >
        <KnowledgeContent info={info} />
      </Modal>
    </div>
  );
}
