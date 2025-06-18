"use client"
import { site } from "../../../config";
import {
  cn,
  Image,
  Listbox,
  ListboxItem,
  ListboxSection,
  ScrollShadow,
  SlotsToClasses,
} from "@heroui/react";
import { useAuth } from "@/libs/auth";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

const listboxSectionClass:
  | SlotsToClasses<"base" | "heading" | "group" | "divider">
  | undefined = {};
const listboxItemClass:
  | SlotsToClasses<
      "title" | "base" | "description" | "selectedIcon" | "wrapper" | "shortcut"
    >
  | undefined = {
  base: cn(
    "mt-1 p-3 text-default-700 rounded-large",
    "data-[selected=true]:bg-primary-50",
    "data-[selected=true]:text-primary-500",
    "data-[selected=true]:dark:bg-primary-800",
    "data-[selected=true]:dark:text-primary-300"
  ),
  title: "ml-2",
};

export const sidebar = [
  {
    items: [
      {
        key: "sideDashboard",
        href: "/dashboard",
        icon: "ri:layout-masonry-line",
      },
      {
        key: "sideKnowledge",
        href: "/dashboard/knowledge",
        icon: "ri:book-2-line",
      },
      {
        key: "sideAppleId",
        href: "/dashboard/appleid",
        icon: "ri:apple-line",
      },
    ],
  },
  {
    key: "sidePlanTitle",
    items: [
      {
        key: "sidePlanBuy",
        href: "/dashboard/plan",
        icon: "ri:shopping-cart-2-line",
      },
      {
        key: "sidePlanNode",
        href: "/dashboard/node",
        icon: "ri:database-2-line",
      },
    ],
  },
  {
    key: "sideFinTitle",
    items: [
      {
        key: "sideFinOrder",
        href: "/dashboard/order",
        icon: "ri:file-list-line",
      },
      {
        key: "sideFinInvite",
        href: "/dashboard/invite",
        icon: "ri:group-line",
      },
    ],
  },
  {
    key: "sideUserTitle",
    items: [
      {
        key: "sideUserInfo",
        href: "/dashboard/profile",
        icon: "ri:info-card-line",
      },
      {
        key: "sideUserTicket",
        href: "/dashboard/ticket",
        icon: "ri:map-2-line",
      },
      {
        key: "sideUserUsage",
        href: "/dashboard/traffic",
        icon: "ri:database-line",
      },
    ],
  },
];

export const Sidebar = ({
  pathName,
  onClose,
}: {
  pathName: string;
  onClose?: () => void;
}) => {
  const t = useTranslations();
  const { remoteConfig } = useAuth();
  return (
    <>
      <div className="flex items-center gap-2 px-2">
        <Image
          src={remoteConfig.logo || undefined}
          alt={remoteConfig.app_name}
          width={32}
          height={32}
          className="h-8 w-8"
        />
        <span className="text-large font-bold uppercase">{remoteConfig.app_name}</span>
      </div>
      <ScrollShadow className="mt-10">
        <Listbox
          aria-label="Listbox"
          variant="flat"
          color="primary"
          className="boarded"
          selectionMode="single"
          selectedKeys={[pathName]}
          hideSelectedIcon
        >
          {sidebar.map((section, index) => {
            const filteredItems = section.items.filter(
              (item) => item.key !== "sideAppleId" || site.appleId.enable
            );
            if (filteredItems.length === 0) return null;
            return (
              <ListboxSection
                key={section.key ?? index}
                title={section.key ? t(section.key) : undefined}
                classNames={listboxSectionClass}
              >
                {filteredItems.map((item) => (
                  <ListboxItem
                    key={item.href}
                    href={item.href}
                    classNames={listboxItemClass}
                    startContent={
                      <Icon
                        icon={
                          pathName === item.href
                            ? item.icon.replace("line", "fill")
                            : item.icon
                        }
                        width={24}
                      />
                    }
                    title={t(item.key)}
                    onPress={onClose}
                  />
                ))}
              </ListboxSection>
            );
          })}
        </Listbox>
      </ScrollShadow>
    </>
  );
};
