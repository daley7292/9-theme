"use client";

import { HeroUIProvider, ToastProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { ProgressProvider as Progress, useRouter } from "@bprogress/next/app";
import { AuthProvider } from "@/libs/auth";
import { useEffect, useState } from "react";
import { semanticColors } from "@heroui/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  useEffect(() => {
    if (window.location.hash) {
      const hash = window.location.hash;
      if (hash.startsWith("#/register")) {
        router.replace(hash.replace("#", "auth"));
      }
    }
  },[]);

  return (
    <HeroUIProvider navigate={router.push}>
      <ToastProvider
        placement="top-center"
        toastOffset={10}
        toastProps={{
          timeout: 3000,
          radius: "lg",
          variant: "flat",
          shouldShowTimeoutProgress: true,
        }}
      />
      <NextThemesProvider attribute="class" defaultTheme="system">
        <AuthProvider>
          <ProgressProvider />
          {children}
        </AuthProvider>
      </NextThemesProvider>
    </HeroUIProvider>
  );
}

const ProgressProvider = () => {
  const { theme, systemTheme } = useTheme();

  const [color, setColor] = useState("");
  useEffect(() => {
    if (!theme) return;
    if (!systemTheme) return;
    let currentTheme = theme;
    if (theme === "system") {
      currentTheme = systemTheme;
    }
    const colorScheme =
      semanticColors[currentTheme as keyof typeof semanticColors];
    setColor(colorScheme.primary[500]!);
  }, [theme, systemTheme]);
  return (
    <Progress
      height="4px"
      color={color}
      options={{ showSpinner: false }}
      shallowRouting
    />
  );
};
