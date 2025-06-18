"use client";

import { I18NSwitch } from "@/components/i18nSwitch";
import { ThemeSwitch } from "@/components/themeSwitch";
import { site } from "../../../config";
import { useAuth } from "@/libs/auth";
import { useRouter } from "@bprogress/next/app";
import { Image } from "@heroui/react";
import { useEffect } from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthChecked, isLoggedIn,remoteConfig } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isAuthChecked && isLoggedIn) {
      router.push("/dashboard");
    }
  }, [isAuthChecked, isLoggedIn]);

  if (!isAuthChecked || isLoggedIn) {
    return null;
  }

  return (
    <div className="relative h-full min-h-dvh w-full flex justify-center items-center">
      <div
        className="absolute inset-0 z-0 hidden sm:flex"
        style={{
          backgroundImage: `url(${site.background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="absolute left-5 top-5">
        <div className="flex items-center gap-2">
          {remoteConfig.logo && (
            <Image
              src={remoteConfig.logo || undefined}
              width={40}
              height={40}
              alt="logo"
              radius="none"
            />
          )}
          <p className="text-foreground font-medium text-xl text-white font-bold">{remoteConfig.app_name}</p>
        </div>
      </div>
      <div className="absolute right-5 top-5">
        <div className="flex items-center gap-2">
          <ThemeSwitch />
          <I18NSwitch />
        </div>
      </div>
      <div className="w-full flex justify-center items-center z-10 my-4 mt-16">
        {children}
      </div>
    </div>
  );
}
