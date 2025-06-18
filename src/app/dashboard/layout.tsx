"use client";

import { Drawer, DrawerContent, useDisclosure } from "@heroui/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@/libs/auth";
import { useRouter } from "@bprogress/next/app";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Navbar } from "@/components/dashboard/navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthChecked, isLoggedIn, logout } = useAuth();
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  const [path, setPath] = useState(pathname);
  useEffect(() => {
    if (pathname !== path) {
      setPath(pathname);
      onClose();
    }
  }, [pathname]);

  useEffect(() => {
    if (isAuthChecked && !isLoggedIn) {
      router.push("/auth/login");
    }
  }, [isAuthChecked, isLoggedIn]);

  if (!isAuthChecked || !isLoggedIn) {
    return null;
  }

  return (
    <div className="flex h-dvh w-full">
      <div className="h-full w-[240px] border-r-small border-divider p-6 hidden md:flex flex-col bg-content1">
        <Sidebar pathName={pathname} onClose={onClose}/>
      </div>
      <div className="w-full flex-1 flex flex-col overflow-auto bg-primary-50/20">
        <Navbar pathName={pathname} onPress={onOpen} />
        <main className="flex-1">{children}</main>
      </div>
      <Drawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="left"
        className="max-w-[280px]"
        radius="none"
        backdrop="blur"
        hideCloseButton
      >
        <DrawerContent>
          {() => (
            <div className="p-6 flex flex-col bg-content1">
              <Sidebar pathName={pathname} />
            </div>
          )}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
