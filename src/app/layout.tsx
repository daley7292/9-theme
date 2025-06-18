import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { geistMono, geistSans } from "@/config/font";
import { site } from "../../config";
import "../styles/globals.css";
import Providers from "./providers";
import { ChatWoot } from "@/components/chatwoot";
export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch(site.api + "/api/v1/guest/comm/config");
    if (!res.ok) throw new Error("Failed to fetch config");
    const json = await res.json();
    const remoteConfig = json.data;
    return {
      title: remoteConfig.app_name || "",
      description: remoteConfig.app_description || "",
      icons: {
        icon: remoteConfig.logo,
      },
    };
  } catch (error) {
    console.error("fetch remoteConfig metadata failed:", error);
  }
  return {
    title: "",
    description: "",
  };
}
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages} timeZone="Asia/Shanghai">
          <Providers>{children}</Providers>
        </NextIntlClientProvider>
        <ChatWoot />
      </body>
    </html>
  );
}
