"use client";

import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { site } from "../../../../config";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import { toast } from "@/libs/toastHandler";
import { Button, cn, Modal, ModalContent, useDisclosure } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { Turnstile } from "@marsidev/react-turnstile";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { useCopyToClipboard } from "usehooks-ts";

export default function Page() {
  const t = useTranslations();

  const { data, isLoading } = useSWR<{ data: SubscribeData }>(
    "user/getSubscribe"
  );
  const isAllowed = useMemo(() => {
    if (isLoading) return 0;
    if (!data || !data.data) return 0;

    const info = data.data;
    // 无套餐、被禁用套餐、流量超标、套餐到期
    if (!info.plan_id) return 1;
    if (site.appleId.disallowedPlanIds.includes(info.plan_id)) return 1;
    if (info.u + info.d > info.transfer_enable) return 1;
    if (info.expired_at && info.expired_at < Date.now() / 1000) return 1;

    return 2;
  }, [isLoading, data]);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    if (isAllowed === 2) {
      if (site.enableCaptcha) {
        onOpen();
      } else {
        handleAppleId();
      }
    }
  }, [isAllowed]);
  const [ids, setIds] = useState<AppleData[]>([]);
  const handleAppleId = async (token?: string) => {
    try {
      const { data }: { data: { suceess: boolean; data: AppleData[] } } =
        await fetch.post("user/appleid", {
          recaptcha_data: token,
        });
      setIds(data.data);
    } catch (e) {
      errorHandle(e);
    }
  };

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
      {isAllowed === 0 && <LoadingInfoCard />}
      {isAllowed === 1 && (
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
            <p className="text-lg font-bold text-center">{t("appleidNo")}</p>
          </div>
        </InfoCard>
      )}
      {isAllowed === 2 &&
        ids.map((item) => <AppleIdCard key={item.id} data={item} />)}
      <Modal placement="center" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <div className="flex justify-center items-center p-4">
              <Turnstile
                siteKey={site.siteKey}
                onSuccess={async (token: string) => {
                  await handleAppleId(token);
                  onClose();
                }}
              />
            </div>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

const AppleIdCard = ({ data }: { data: AppleData }) => {
  const t = useTranslations();
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden h-auto text-foreground box-border bg-content1",
        "shadow-medium rounded-large w-full",
        "hover:shadow-md hover:shadow-primary-500/20 transition-shadow",
        "hover:shadow-primary-500/20"
      )}
    >
      <div className="p-6">
        <div className="flex-1 truncate">
          <div className="flex items-center space-x-3">
            <h3 className="truncate font-bold tracking-wider text-default-700">
              {t("appleidAccount", {
                data: data.username,
              })}
            </h3>
          </div>
          <p className="mt-1 truncate tracking-wider text-default-700">
            {t("appleidPassword", {
              data: data.password,
            })}
          </p>
          <p className="mt-1 truncate text-sm text-default-500">
            {t("appleidUpdateAt", {
              data: data.last_check,
            })}
          </p>
          <p className="mt-1 truncate text-sm text-default-500">
            {t("appleidStatus", {
              data: data.message,
            })}
          </p>
        </div>
      </div>
      <div>
        <div className="-mt-px flex gap-1">
          <div className="flex w-0 flex-1">
            <Button
              fullWidth
              radius="none"
              variant="flat"
              color="primary"
              className="rounded-bl-large"
              onPress={async () => {
                await copyToClipboard(data.username);
                toast.success(t("appleidCopySuccess"));
              }}
            >
              {t("appleidCopyAcc")}
            </Button>
          </div>
          <div className="-ml-px flex w-0 flex-1">
            <Button
              fullWidth
              radius="none"
              variant="flat"
              color="primary"
              className="rounded-br-large"
              onPress={async () => {
                await copyToClipboard(data.password);
                toast.success(t("appleidCopySuccess"));
              }}
            >
              {t("appleidCopyPass")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
