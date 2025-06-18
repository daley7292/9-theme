"use client";

import { InfoCard, LoadingInfoCard } from "@/components/dashboard/infoCard";
import { useFormatter, useTranslations } from "next-intl";
import useSWR from "swr";
import { filesize } from "filesize";
import {
  Button,
  Card,
  cn,
  Image,
  Link,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Progress,
  Tab,
  Tabs,
  Modal,
  useDisclosure,
} from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import { RedeemContent } from "@/components/dashboard/redeemContent";
import { PlanButton } from "@/components/dashboard/planButton";
import { Icon } from "@iconify/react/dist/iconify.js";
import { motion } from "framer-motion";
import * as rdd from "react-device-detect";
import { toast } from "@/libs/toastHandler";
import { QRCodeSVG } from "qrcode.react";
import { thirdApp } from "@/config/thirdApp";
import { app2scheme } from "@/libs/utils";
import { useAuth } from "@/libs/auth";
import { site } from "../../../config";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { useCopyToClipboard } from "usehooks-ts";

export default function Page() {
  const { remoteConfig } = useAuth();
  const t = useTranslations();
  const format = useFormatter();
  const [, copy] = useCopyToClipboard();
  const [redeem, setRedeem] = useState("");
  const {
    data,
    isLoading: dataLoading,
    mutate,
  } = useSWR<{ data: SubscribeData }>("user/getSubscribe");

  const trafficInfo = useMemo(() => {
    if (!data || !data.data) return { u: 0, d: 0, transfer_enable: 0 };
    const { u, d, transfer_enable } = data.data;
    return { u, d, transfer_enable };
  }, [data]);
  const trafficColor = useMemo(() => {
    if (!data || !data.data) return "default";
    const traffic = (data.data.u + data.data.d) / data.data.transfer_enable;

    if (traffic >= 0.8) return "danger";
    if (traffic >= 0.6) return "warning";
    return "success";
  }, [data]);
  const expiredInfo = useMemo(() => {
    const info = {
      expired_at: 0,
      reset_day: 0,
    };
    if (!data || !data.data) return info;
    info.reset_day = data.data.reset_day ?? -1;
    if (!data.data.expired_at) return info;
    info.expired_at = data.data.expired_at;
    return info;
  }, [data]);
  const expiredColor = useMemo(() => {
    if (!data || !data.data) return "default";
    if (data.data.reset_day === null) return "default";
    const reset_day = data.data.reset_day;

    if (reset_day >= 15) return "success";
    if (reset_day >= 7) return "warning";
    return "danger";
  }, [data]);
  const planInfo = useMemo(() => {
    if (!data || !data.data) return null;
    return data.data.plan;
  }, [data]);

  const subscribeUrl = useMemo(() => {
    if (!data || !data.data) return "";
    return data.data.subscribe_url;
  }, [data]);
  const {
    isOpen: isRedeemOpen,
    onOpen: onRedeemOpen,
    onOpenChange: onRedeemOpenChange,
    onClose: onRedeemClose,
  } = useDisclosure();
  const [isHovered, setIsHovered] = useState(false);

  const [selectedKey, setSelectedKey] = useState("iOS");
  useEffect(() => {
    const allowedOS = ["iOS", "Mac OS", "Windows", "Android"];
    if (!allowedOS.includes(rdd.osName)) {
      setSelectedKey("iOS");
    }
    setSelectedKey(rdd.osName);
  }, [rdd.osName]);

  return (
    <div className="flex flex-col items-start justify-center gap-4 p-6 md:px-12">
      <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4 w-full ">
        <NoticeCard />
        {dataLoading ? (
          <LoadingInfoCard />
        ) : planInfo ? (
          <InfoCard
            className={cn("col-span-1")}
            icon=""
            title={t("dashboardPlan")}
            endContent={
              <PlanButton href={`/dashboard/plan?id=${planInfo.id}`}>
                {t("dashboardPlanRenew")}
              </PlanButton>
            }
          >
            <span className="text-xl text-default-700 font-bold">
              {planInfo.name}
            </span>
          </InfoCard>
        ) : (
          <Card
            as={Link}
            className={cn(
              "col-span-1 min-h-44",
              "p-3 hover:shadow-md hover:shadow-primary-500/20 transition-shadow",
              "flex flex-col justify-center items-center",
              "border-1 border-dashed border-default-300"
            )}
            radius="lg"
            isPressable={!rdd.isMobile}
            href="/plan"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              animate={
                isHovered ? { rotate: [0, -5, 5, -5, 5, 0] } : { rotate: 0 }
              }
              transition={{ duration: 0.5 }}
            >
              <Icon
                className="w-12 h-12 mx-auto mb-2 text-primary"
                icon=""
                width={30}
              />
            </motion.div>
            <h2 className="text-xl font-semibold mb-2">
              {t("dashboardPlanNo")}
            </h2>
            <p className="text-default-500 mb-4"> {t("dashboardPlanNoDesc")}</p>
          </Card>
        )}
        <InfoCard
          className={cn("col-span-1")}
          icon=""
          title={t("dashboardExpire")}
          isLoading={dataLoading}
          endContent={
            <Progress
              value={30 - (expiredInfo.reset_day ?? 30)}
              isDisabled={expiredInfo.reset_day < 0}
              maxValue={30}
              label={
                expiredInfo.reset_day < 0
                  ? t("dashboardExpireResetNo")
                  : expiredInfo.reset_day === 0
                  ? t("dashboardExpireResetToday") // 添加一个对应的多语言 key，比如 "今天已重置流量"
                  : t("dashboardExpireReset") +
                    " " +
                    t("dashboardExpireResetDay", {
                      day: expiredInfo.reset_day,
                    })
              }
              color={expiredColor}
              size="sm"
              classNames={{
                label: "text-default-500",
                value: "text-default-500",
              }}
            />
          }
        >
          <span className="text-xl text-default-700">
            {planInfo ? (
              !expiredInfo.expired_at ? (
                t("dashboardExpireNo")
              ) : (
                <span
                  className={cn(
                    expiredInfo.expired_at * 1000 < Math.floor(Date.now()) &&
                      "text-danger-500"
                  )}
                >
                  {t.rich("dashboardExpireAt", {
                    date: (date) => (
                      <span className="font-bold">
                        {format.dateTime(expiredInfo.expired_at * 1000, {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "numeric",
                          minute: "numeric",
                        })}
                      </span>
                    ),
                  })}
                </span>
              )
            ) : (
              t("dashboardExpireNoPlan")
            )}
          </span>
        </InfoCard>
        <InfoCard
          className={cn("col-span-1")}
          icon=""
          title={t("dashboardTraffic")}
          isLoading={dataLoading}
          endContent={
            <Progress
              value={trafficInfo.u + trafficInfo.d}
              // 防止NaN
              maxValue={
                !trafficInfo.transfer_enable ? 1 : trafficInfo.transfer_enable
              }
              label={t("dashboardTrafficDesc")}
              showValueLabel={true}
              color={trafficColor}
              size="sm"
              classNames={{
                label: "text-default-500",
                value: "text-default-500",
              }}
            />
          }
        >
          <span className="text-xl font-bold text-default-700">
            {`${filesize(trafficInfo.u + trafficInfo.d, {
              standard: "jedec",
            })} / ${filesize(trafficInfo.transfer_enable, {
              standard: "jedec",
            })}`}
          </span>
        </InfoCard>
        <InfoCard
          className="col-span-1"
          title={t("profileRedeem")}
          icon="ri:bank-card-line"
          endContent={
            <Button
              size="sm"
              variant="flat"
              color="primary"
              className={cn(
                "transition-transform duration-300 hover:scale-105 tracking-wider"
              )}
              onPress={() => {
                if (!redeem) {
                  toast.error(t("profileRedeemEmpty"));
                } else {
                  onRedeemOpen();
                }
              }}
            >
              {t("profileRedeemButton")}
            </Button>
          }
        >
          <Input
            radius="lg"
            variant="bordered"
            placeholder={t("profileRedeemDesc")}
            value={redeem}
            onValueChange={setRedeem}
            classNames={{
              label: "group-data-[filled-within=true]:text-default-500 text-sm",
              input: "placeholder:text-foreground-700 placeholder:text-tiny",
              inputWrapper:
                "border-primary/25 data-[hover=true]:border-primary/50 group-data-[focus=true]:border-primary/75",
            }}
          />
        </InfoCard>
      </div>
      <div className="grid xl:grid-cols-2 gap-4 w-full ">
        <InfoCard
          className={cn("col-span-1")}
          icon=""
          title={t("dashboardImport")}
          isLoading={dataLoading}
          endContent={
            <div className="w-full flex flex-col justify-center items-center">
              <Tabs
                aria-label="Import Tabs"
                variant="solid"
                classNames={{
                  panel: cn(
                    "mt-2 p-2 rounded-large",
                    "w-full flex flex-row gap-2 justify-center md:justify-start items-center flex-wrap"
                  ),
                }}
                selectedKey={selectedKey}
                onSelectionChange={(key) => setSelectedKey(key.toString())}
              >
                {thirdApp.map((app) => (
                  <Tab key={app.name} title={app.name} className="">
                    {app.appDetail.map((detail) => (
                      <Button
                        key={detail.name}
                        className={cn(
                          "flex flex-col gap-2 h-24 w-24",
                          "justify-center items-center",
                          "transition-transform duration-300 hover:scale-105"
                        )}
                        variant="flat"
                        as={Link}
                        href={app2scheme(
                          detail.scheme,
                          subscribeUrl,
                          remoteConfig.app_name
                        )}
                        target="_self"
                      >
                        <Image src={detail.icon} alt={detail.name} width={36} />
                        {detail.name}
                      </Button>
                    ))}
                  </Tab>
                ))}
              </Tabs>
            </div>
          }
        >
          <div className="grid grid-cols-2 gap-4">
            <Button
              className="w-full transition-transform duration-300 hover:scale-105 tracking-wider"
              radius="lg"
              variant="flat"
              color="primary"
              onPress={() => {
                copy(subscribeUrl);
                toast.success(t("dashboardImportCopyDesc"));
              }}
              isDisabled={dataLoading}
            >
              {t("dashboardImportCopy")}
            </Button>
            <Popover placement="bottom" showArrow>
              <PopoverTrigger>
                <Button
                  className="w-full transition-transform duration-300 hover:scale-105 tracking-wider"
                  radius="lg"
                  variant="ghost"
                  color="primary"
                  isDisabled={dataLoading}
                >
                  {t("dashboardImportQR")}
                </Button>
              </PopoverTrigger>
              <PopoverContent>
                <div className="p-2 flex flex-col items-center">
                  <QRCodeSVG
                    value={subscribeUrl}
                    size={192}
                    level="L"
                    className="border border-gray-200"
                  />
                  <br />
                  <p className="font-semibold tracking-wider">
                    {t("dashboardImportQRDesc")}
                  </p>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </InfoCard>
        <InfoCard
          className={cn("col-span-1")}
          icon=""
          title={t("dashboardDownload")}
          isLoading={dataLoading}
        >
          <div className="h-full flex flex-row flex-wrap gap-4 justify-start items-start">
            {site.clients.map((detail) => (
              <Button
                key={detail.key}
                className={cn(
                  "flex flex-col gap-2 h-24 w-24",
                  "justify-center items-center",
                  "transition-transform duration-300 hover:scale-105"
                )}
                variant="flat"
                as={Link}
                href={detail.link}
                target="_self"
              >
                <Icon icon={detail.icon} width={36} />
                {detail.key}
              </Button>
            ))}
          </div>
        </InfoCard>
      </div>
      <Modal
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isRedeemOpen}
        scrollBehavior="inside"
        onOpenChange={onRedeemOpenChange}
      >
        <RedeemContent
          onClose={() => {
            mutate();
            onRedeemClose();
          }}
          redeem={redeem}
          setRedeem={setRedeem}
        />
      </Modal>
    </div>
  );
}
