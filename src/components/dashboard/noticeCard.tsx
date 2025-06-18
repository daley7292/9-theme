import { Button, cn, Modal, useDisclosure } from "@heroui/react";
import { useEffect, useMemo, useState } from "react";
import useSWR from "swr";
import { NoticeContent } from "./noticeContent";
import { InfoCard } from "./infoCard";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";

export const NoticeCard = () => {
    const t = useTranslations();
    const format = useFormatter();
    const pathName = usePathname();

    const { data, isLoading } = useSWR < { data: NoticeData[] | PopMessageData[] } > (
        pathName === "/dashboard"
            ? "user/notice/fetch"
            : `user/notice/getPopMessage?windows_type=${mapping[pathName].id}`
    );
    const noticeInfo = useMemo(() => {
        if (!data || !data.data) return [];
        return data.data;
    }, [data]);
    useEffect(() => {
        if (!noticeInfo || !Array.isArray(noticeInfo) || noticeInfo.length === 0) return;

        const currentMappingId = mapping[pathName]?.id;
        if (currentMappingId === undefined) return;

        for (let i = 0; i < noticeInfo.length; i++) {
            const item = noticeInfo[i];
            if (
                item?.tags?.includes("弹窗") &&
                item.windows_type === currentMappingId
            ) {
                setNoticePage(i);
                onOpen();
                return;
            }
        }
    }, [noticeInfo, pathName]);
    const [noticePage, setNoticePage] = useState(0);
    const { isOpen, onOpen, onOpenChange } = useDisclosure();

    return (
        <>
            <InfoCard
                className={cn(
                    mapping[pathName].className,
                    pathName !== "/dashboard" && !noticeInfo.length && "hidden"
                )}
                icon=""
                title={
                    <div className="flex flex-row gap- justify-between items-center w-full">
                        <span> {t("dashboardNotice")}</span>
                        <span className="text-sm text-default-500">
                            {noticeInfo.length > 0 &&
                                t("dashboardNoticePage", {
                                    page: noticePage + 1,
                                    total: noticeInfo.length,
                                })}
                        </span>
                    </div>
                }
                isLoading={isLoading}
                endContent={
                    <div className="flex flex-row gap-2 justify-between items-center w-full">
                        <Button
                            size="sm"
                            variant="flat"
                            color="primary"
                            startContent={<Icon icon="ri:error-warning-line" />}
                            onPress={onOpen}
                            isDisabled={noticeInfo.length === 0}
                            className="transition-transform duration-300 hover:scale-105 tracking-wider"
                        >
                            {t("dashboardNoticeDetail")}
                        </Button>
                        <div className="flex flex-row gap-2 justify-between items-center">
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                isDisabled={noticePage === 0 || noticeInfo.length === 0}
                                startContent={<Icon icon="ri:arrow-left-s-line" />}
                                onPress={() => setNoticePage((p) => p - 1)}
                                className="transition-transform duration-300 hover:scale-105 tracking-wider"
                            >
                                {t("dashboardNoticePrev")}
                            </Button>
                            <Button
                                size="sm"
                                variant="flat"
                                color="primary"
                                isDisabled={
                                    noticePage === noticeInfo.length - 1 ||
                                    noticeInfo.length === 0
                                }
                                startContent={<Icon icon="ri:arrow-right-s-line" />}
                                onPress={() => setNoticePage((p) => p + 1)}
                                className="transition-transform duration-300 hover:scale-105 tracking-wider"
                            >
                                {t("dashboardNoticeNext")}
                            </Button>
                        </div>
                    </div>
                }
            >
                <div className="flex flex-row gap-2 justify-between items-center w-full">
                    <span className="text-xl font-bold text-default-700">
                        {noticeInfo.length > 0
                            ? noticeInfo[noticePage].title
                            : t("dashboardNoticeNo")}
                    </span>
                    <span className="text-sm text-default-500">
                        {noticeInfo.length > 0 &&
                            t("createAt", {
                                date: format.dateTime(
                                    noticeInfo[noticePage].updated_at * 1000,
                                    {
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                        hour: "numeric",
                                        minute: "numeric",
                                    }
                                ),
                            })}
                    </span>
                </div>
            </InfoCard>
            <Modal
                hideCloseButton
                isDismissable={false}
                isKeyboardDismissDisabled
                isOpen={isOpen}
                scrollBehavior="inside"
                onOpenChange={onOpenChange}
                size="2xl"
            >
                <NoticeContent content={noticeInfo[noticePage]} />
            </Modal>
        </>
    );
};

interface PopMessageType {
    [key: string]: PopMessageMapping;
}
interface PopMessageMapping {
    id?: number;
    className?: string | string[];
}

const mapping: PopMessageType = {
    "/dashboard": {
        id: 0,
        className: [
            "col-span-1",
            "ml-auto",
            "col-start-1 row-start-1",
            "lg:col-span-1 lg:col-start-1 lg:row-start-1",
            "xl:col-span-1 xl:col-start-1 xl:row-start-1",
        ],
    },
    "/dashboard/knowledge": {
        id: 1,
        className: "col-span-full",
    },
    "/dashboard/plan": {
        id: 2,
        className: "col-span-full",
    },
    "/dashboard/node": {
        id: 3,
        className: "col-span-full",
    },
    "/dashboard/order": {
        id: 4,
        className: "col-span-full",
    },
    "/dashboard/invite": {
        id: 5,
        className: "col-span-full",
    },
    "/dashboard/ticket": {
        id: 6,
        className: "col-span-full",
    },
    "/dashboard/profile": {
        id: 7,
        className: "col-span-full",
    },
};
