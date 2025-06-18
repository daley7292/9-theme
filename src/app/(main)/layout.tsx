"use client";

import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Divider,
  Image,
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Spacer,
} from "@heroui/react";

import { motion } from "framer-motion";
import { ThemeSwitch } from "@/components/themeSwitch";
import { usePathname } from "next/navigation";
import { I18NSwitch } from "@/components/i18nSwitch";
import { useTranslations } from "next-intl";
import { useAuth } from "@/libs/auth";

const AnimatedIcon = ({ isOpen }: { isOpen: boolean }) => (
  <motion.div
    variants={{
      closed: { rotate: 0 },
      open: { rotate: 90 },
    }}
    initial="closed"
    animate={isOpen ? "open" : "closed"}
    transition={{ duration: 0.3 }}
  >
    {isOpen ? (
      <Icon icon="ri:close-line" width={24} />
    ) : (
      <Icon icon="ri:menu-line" width={24} />
    )}
  </motion.div>
);
const menuItems = ["home", "shop", "faq"];

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();
  const t = useTranslations();

  const { isLoggedIn,remoteConfig } = useAuth();

  return (
    <div className="relative flex min-h-dvh w-full flex-col">
      <Navbar isBordered position="sticky" maxWidth="xl">
        <NavbarMenuToggle
          icon={(isOpen) => <AnimatedIcon isOpen={isOpen} />}
          className="flex md:hidden"
        />
        <NavbarBrand className="max-w-fit">
          <Image
            src={remoteConfig.logo || undefined}
            alt={remoteConfig.app_name}
            width={32}
            height={32}
            className="min-w-[32px] min-h-[32px]"
          />
          <p className="font-bold text-inherit ml-2">{remoteConfig.app_name}</p>
        </NavbarBrand>
        <NavbarContent justify="center" className="w-full gap-8 hidden md:flex">
          {menuItems.map((item, index) => {
            const href = item == "home" ? "/" : `/${item}`;
            return (
              <NavbarItem key={`${item}-${index}`} isActive={pathName === href}>
                <Link
                  color={pathName === href ? "primary" : "foreground"}
                  href={href}
                  className={pathName === href ? "font-bold" : ""}
                >
                  {t("navItems." + item)}
                </Link>
              </NavbarItem>
            );
          })}
        </NavbarContent>
        <NavbarContent justify="end" className="gap-2">
          <NavbarItem className="hidden sm:flex">
            <ThemeSwitch />
          </NavbarItem>
          <NavbarItem className="hidden sm:flex">
            <I18NSwitch />
          </NavbarItem>
          {isLoggedIn ? (
            <NavbarItem>
              <Button
                as={Link}
                href="/dashboard"
                color="primary"
                radius="lg"
                endContent={<Icon icon="ri:arrow-right-line" />}
              >
                {t("navDashboard")}
              </Button>
            </NavbarItem>
          ) : (
            <>
              <NavbarItem className="hidden sm:flex">
                <Button
                  as={Link}
                  href="/auth/register"
                  radius="lg"
                  variant="flat"
                  color="primary"
                >
                  {t("navRegister")}
                </Button>
              </NavbarItem>
              <NavbarItem>
                <Button
                  as={Link}
                  href="/auth/login"
                  color="primary"
                  radius="lg"
                  endContent={<Icon icon="ri:arrow-right-line" />}
                >
                  {t("navLogin")}
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
        <NavbarMenu
          className="top-[calc(var(--navbar-height)_-_1px)] max-h-fit bg-default-200/50 pb-6 pt-6 shadow-medium backdrop-blur-md backdrop-saturate-150 dark:bg-default-100/50"
          motionProps={{
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
            transition: {
              ease: "easeInOut",
              duration: 0.2,
            },
          }}
        >
          {menuItems.map((item, index) => {
            const href = item == "home" ? "/" : `/${item}`;
            return (
              <NavbarMenuItem
                key={`${item}-${index}`}
                isActive={pathName === href}
              >
                <Link
                  className="mb-2 w-full text-default-500"
                  href={href}
                  size="md"
                >
                  {t("navItems." + item)}
                </Link>
                {index < menuItems.length - 1 && (
                  <Divider className="opacity-50" />
                )}
              </NavbarMenuItem>
            );
          })}
        </NavbarMenu>
      </Navbar>
      <main className="container mx-auto mt-[64px] max-w-[1280px] flex flex-col items-center px-8">
        {children}
      </main>
      <footer className="flex w-full flex-col">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center px-6 py-12 lg:px-8">
          <div className="flex items-center justify-center gap-2">
            <Image src={remoteConfig.logo || undefined} alt={remoteConfig.app_name} width={32} height={32} />
            <span className="text-small font-medium">{remoteConfig.app_name}</span>
          </div>
          <Spacer y={2} />
          <Chip
            className="border-none px-0 text-default-500"
            color="success"
            variant="dot"
          >
            All systems operational
          </Chip>
          <Spacer y={2} />
          <p className="mt-1 text-center text-small text-default-400">
            &copy; 2024 {remoteConfig.app_name}. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
