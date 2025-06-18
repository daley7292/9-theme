"use client";

import { InfoCard } from "@/components/dashboard/infoCard";
import { InviteList } from "@/components/dashboard/inviteList";
import { TransferContent } from "@/components/dashboard/transferContent";
import { WithdrawContent } from "@/components/dashboard/withdrawContent";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import {
  Button,
  Card,
  cn,
  Link,
  Modal,
  Skeleton,
  Snippet,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import { useCallback } from "react";
import useSWR from "swr";

const stats = [
  "ri:user-add-line",
  "ri:coins-line",
  "ri:cash-line",
  "ri:percent-line",
];
const platforms = [
  {
    name: "Telegram",
    icon: "ri:telegram-fill",
  },
  {
    name: "X",
    icon: "ri:twitter-x-line",
  },
];
const shareLink = (platform: string, link: string, text: string) => {
  const url = encodeURIComponent(link);
  switch (platform) {
    case "telegram":
      return "https://t.me/share/url?url=" + url + "&text=" + text;
    case "x":
      return "https://x.com/intent/post?text=" + text + "&url=" + url;
    default:
      return "";
  }
};

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();

  const { remoteConfig } = useAuth();
  const { data, isLoading, mutate } = useSWR("user/invite/fetch");

  const generateCode = async () => {
    try {
      await fetch.get("user/invite/save");
      await mutate();
    } catch (e) {
      errorHandle(e);
    }
  };
  const inviteLink = useCallback(() => {
    if (!data) return "";
    if (!data.data) return "";
    if (!data.data.codes) return "";
    if (!Array.isArray(data.data.codes)) return "";
    if (data.data.codes.length === 0) {
      generateCode();
      return "";
    }
    const url = new URL(
      `auth/register?code=${data.data.codes[0].code}`,
      remoteConfig?.app_url ?? ""
    );
    return url.toString();
  }, [data]);

  const {
    isOpen: isTransferOpen,
    onOpen: onTransferOpen,
    onOpenChange: onTransferOpenChange,
    onClose: onTransferClose,
  } = useDisclosure();
  const {
    isOpen: isWithdrawOpen,
    onOpen: onWithdrawOpen,
    onOpenChange: onWithdrawOpenChange,
    onClose: onWithdrawClose,
  } = useDisclosure();

  const parseData = useCallback(
    (value: number) => {
      const stats = [0, 0, 0, 0, 0];
      if (!data || !data.data) return stats[value];
      if (!data.data.stat) return stats[value];

      const dataStats = data.data.stat;
      if (value === 3) {
        return `${dataStats[value]}%`;
      } else if (value === 0) {
        return dataStats[value];
      }
      return format.number(dataStats[value] / 100, {
        style: "currency",
        currency: "CNY",
      });
    },
    [data]
  );

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 col-span-full">
      <NoticeCard />
        <InfoCard
          className="col-span-1"
          title={t("inviteBalance")}
          icon=""
          isLoading={isLoading}
          endContent={
            <div className="flex flex-row gap-2 items-center">
              <Button
                size="sm"
                variant="bordered"
                color="primary"
                className={cn(
                  "transition-transform duration-300 hover:scale-105 tracking-wider"
                )}
                onPress={onTransferOpen}
              >
                {t("inviteTransfer")}
              </Button>
              <Button
                size="sm"
                variant="flat"
                color="primary"
                className={cn(
                  "transition-transform duration-300 hover:scale-105 tracking-wider"
                )}
                onPress={onWithdrawOpen}
              >
                {t("inviteWithdraw")}
              </Button>
            </div>
          }
        >
          <span className="text-4xl font-bold tracking-wider">
            {parseData(4)}
          </span>
        </InfoCard>
        <InfoCard
          className="xl:col-span-3"
          title={t("inviteLink")}
          icon=""
          isLoading={isLoading}
          endContent={
            <div className="flex flex-row gap-2 items-center">
              {platforms.map((platform) => (
                <Button
                  key={platform.name}
                  isIconOnly
                  variant="light"
                  size="sm"
                  as={Link}
                  target="_blank"
                  href={shareLink(
                    platform.name.toLowerCase(),
                    inviteLink(),
                    t("inviteShareText")
                  )}
                >
                  <Icon icon={platform.icon} width={24} />
                </Button>
              ))}
            </div>
          }
        >
          <Snippet
            fullWidth
            hideSymbol
            disableTooltip
            size="sm"
            className="border-primary/50 hover:border-primary/75"
            onCopy={() => {
              toast.success(t("inviteCopy"));
            }}
            classNames={{
              pre: "truncate",
              copyButton: "text-primary",
            }}
            copyIcon={<Icon icon="ri:file-copy-2-line" width={20} />}
            checkIcon={<Icon icon="ri:checkbox-multiple-line" width={20} />}
          >
            {inviteLink()}
          </Snippet>
        </InfoCard>
      </div>
      {/* <InfoCard
        className="col-span-full"
        title={t("inviteRulesTitle")}
        icon="tabler:user-share"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {rules.map((rule, index) => (
            <div
              key={index}
              className={cn(
                "w-full h-full p-4",
                "flex flex-row gap-4",
                "justify-start items-center",
                "bg-primary-50/25 rounded-large"
              )}
            >
              <Icon
                icon={rule}
                width={48}
                height={48}
                className="p-2 text-primary-300 bg-primary-50 rounded-large"
              />
              <div className="flex flex-col gap-1 flex-1">
                <span className="text-md font-semibold">
                  {t(`inviteRules.${index}.title`)}
                </span>
                <span className="text-sm text-default-500">
                  {t(`inviteRules.${index}.desc`)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </InfoCard> */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 col-span-full">
        {stats.map((rule, index) => (
          <Card
            key={index}
            className={cn(
              "col-span-1",
              "w-full h-full p-4",
              "flex flex-row gap-4",
              "justify-start items-center",
              "hover:shadow-md hover:shadow-primary-500/20 transition-shadow"
            )}
          >
            <Icon
              icon={rule}
              width={48}
              height={48}
              className="p-2 text-primary-300 bg-primary-50 rounded-large"
            />
            <div className="flex flex-col gap-1">
              <span className="text-sm text-default-500 font-semibold">
                {t(`inviteStats.${index}`)}
              </span>
              <span className="text-xl font-bold tracking-wider">
                {isLoading ? (
                  <Skeleton className="rounded-lg">Skeleton</Skeleton>
                ) : (
                  parseData(index)
                )}
              </span>
            </div>
          </Card>
        ))}
      </div>
      <InviteList />
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isTransferOpen}
        scrollBehavior="inside"
        onOpenChange={onTransferOpenChange}
      >
        <TransferContent
          onClose={onTransferClose}
          mutate={mutate}
          balance={data && data.data ? data.data.stat[4] : 0}
        />
      </Modal>
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isWithdrawOpen}
        scrollBehavior="inside"
        onOpenChange={onWithdrawOpenChange}
      >
        <WithdrawContent onClose={onWithdrawClose} />
      </Modal>
    </div>
  );
}
