"use client";

import { ChangeContent } from "@/components/dashboard/changeContent";
import { DeviceList } from "@/components/dashboard/deviceList";
import { InfoCard } from "@/components/dashboard/infoCard";
import { NoticeCard } from "@/components/dashboard/noticeCard";
import { RedeemContent } from "@/components/dashboard/redeemContent";
import { ResetContent } from "@/components/dashboard/resetContent";
import { useAuth } from "@/libs/auth";
import errorHandle from "@/libs/errorHandler";
import { fetch } from "@/libs/request";
import {
  Avatar,
  Button,
  Card,
  CardBody,
  CardHeader,
  cn,
  Input,
  Modal,
  Skeleton,
  Switch,
  useDisclosure,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import { useState, useTransition } from "react";

const notices = ["remind_expire", "remind_traffic"];

export default function Page() {
  const t = useTranslations();
  const format = useFormatter();
  const { userInfo, loadUserInfo } = useAuth();

  const [redeem, setRedeem] = useState("");

  const [switcher, setSwitcher] = useState({
    remind_expire: false,
    remind_traffic: false,
  });
  const updateRemind = async (t: string, isSelected: boolean) => {
    try {
      setSwitcher({ ...switcher, [t]: true });
      await fetch.post("user/update", {
        [t]: isSelected ? 1 : 0,
      });
      await loadUserInfo();
    } catch (e) {
      errorHandle(e);
    } finally {
      setSwitcher({ ...switcher, [t]: false });
    }
  };
  const {
    isOpen: isResetOpen,
    onOpen: onResetOpen,
    onOpenChange: onResetOpenChange,
    onClose: onResetClose,
  } = useDisclosure();
  const {
    isOpen: isChangeOpen,
    onOpen: onChangeOpen,
    onOpenChange: onChangeOpenChange,
    onClose: onChangeClose,
  } = useDisclosure();
  const {
    isOpen: isRedeemOpen,
    onOpen: onRedeemOpen,
    onOpenChange: onRedeemOpenChange,
    onClose: onRedeemClose,
  } = useDisclosure();

  return (
    <div className="gap-4 p-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
      <NoticeCard />
      <Card
        className={cn(
          "col-span-1",
          "hover:shadow-md hover:shadow-primary-500/20 transition-shadow"
        )}
      >
        <CardHeader
          className={cn(
            "relative flex h-[100px] flex-col justify-end overflow-visible",
            "bg-gradient-to-br from-primary-400 via-primary-200 to-primary-50"
          )}
        >
          <Avatar
            name={userInfo?.email ?? ""}
            src={userInfo?.avatar_url ?? ""}
            className="h-20 w-20 translate-y-12"
          />
          <Button
            className="absolute right-3 top-3 bg-white/20 text-white dark:bg-black/20"
            radius="full"
            size="sm"
            variant="light"
            isDisabled
          >
            编辑信息
          </Button>
        </CardHeader>
        <CardBody>
          <div className="pb-2 pt-8 text-center">
            <p className="text-large font-medium">
              {!userInfo ? (
                <Skeleton className="rounded-large">Skeleton</Skeleton>
              ) : (
                userInfo.email
              )}
            </p>
            <p className="text-small text-default-400">
              {!userInfo ? (
                <Skeleton className="rounded-large">Skeleton</Skeleton>
              ) : (
                t("profileJoined", {
                  date: format.dateTime(userInfo.created_at * 1000, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  }),
                })
              )}
            </p>
          </div>
        </CardBody>
      </Card>
      <InfoCard
        className="col-span-1"
        title={t("profileWallet")}
        icon=""
        isLoading={!userInfo}
        endContent={
          <span className="text-default-500">{t("profileWalletDesc")}</span>
        }
      >
        <span className="text-4xl font-bold tracking-wider">
          {!userInfo ? (
            <Skeleton className="rounded-large">Skeleton</Skeleton>
          ) : (
            format.number(userInfo.balance / 100, {
              style: "currency",
              currency: "CNY",
            })
          )}
        </span>
      </InfoCard>
      <InfoCard
        className="col-span-1"
        title={t("profileNotice")}
        icon=""
        isLoading={!userInfo}
      >
        <div className="w-full flex flex-col gap-2">
          {notices.map((item, index) => {
            const isSelected = userInfo?.[item as keyof typeof userInfo] == 1;
            const status = switcher[item as keyof typeof switcher];
            return (
              <Skeleton
                key={item}
                isLoaded={!!userInfo}
                className="rounded w-full"
              >
                <Switch
                  size="sm"
                  isSelected={isSelected}
                  onValueChange={(isSelected) => {
                    updateRemind(item, isSelected);
                  }}
                  classNames={{
                    base: cn(
                      "inline-flex bg-content2 flex-row-reverse w-full max-w-full items-center",
                      "justify-between cursor-pointer rounded-medium gap-3 p-3 bg-primary-50/25"
                    ),
                    thumbIcon: cn(status && "animate-spin"),
                  }}
                  isReadOnly={status}
                  thumbIcon={status && <Icon icon="ri:loader-2-line" />}
                >
                  <p className="text-sm text-default-600">
                    {t(`profileNotices.${index}.title`)}
                  </p>
                  <p className="text-tiny text-default-400">
                    {t(`profileNotices.${index}.desc`)}
                  </p>
                </Switch>
              </Skeleton>
            );
          })}
        </div>
      </InfoCard>
      <InfoCard
        color="danger"
        className="col-span-1 text-danger"
        title={
          <span className="text-danger-500">{t("profileChangePass")}</span>
        }
        icon=""
        endContent={
          <Button
            size="sm"
            variant="flat"
            color="danger"
            className={cn(
              "transition-transform duration-300 hover:scale-105 tracking-wider"
            )}
            onPress={onChangeOpen}
          >
            {t("profileChangeButton")}
          </Button>
        }
      >
        <div className="text-sm text-danger-400 font-bold tracking-wider">
          {t("profileChangeDesc")}
        </div>
      </InfoCard>
      <InfoCard
        color="danger"
        className="col-span-1 text-danger"
        title={
          <span className="text-danger-500">{t("profileResetToken")}</span>
        }
        icon=""
        endContent={
          <Button
            size="sm"
            variant="flat"
            color="danger"
            className={cn(
              "transition-transform duration-300 hover:scale-105 tracking-wider"
            )}
            onPress={onResetOpen}
          >
            {t("profileResetButton")}
          </Button>
        }
      >
        <div className="text-sm text-danger-400 font-bold tracking-wider">
          {t("profileResetDesc")}
        </div>
      </InfoCard>
      <DeviceList />
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isResetOpen}
        scrollBehavior="inside"
        onOpenChange={onResetOpenChange}
      >
        <ResetContent onClose={onResetClose} />
      </Modal>
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isChangeOpen}
        scrollBehavior="inside"
        onOpenChange={onChangeOpenChange}
      >
        <ChangeContent onClose={onChangeClose} />
      </Modal>
      <Modal
        placement="center"
        hideCloseButton
        isDismissable={false}
        isKeyboardDismissDisabled
        isOpen={isRedeemOpen}
        scrollBehavior="inside"
        onOpenChange={onRedeemOpenChange}
      >
        <RedeemContent
          onClose={onRedeemClose}
          redeem={redeem}
          setRedeem={setRedeem}
        />
      </Modal>
    </div>
  );
}
