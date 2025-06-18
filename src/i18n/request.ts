import { getRequestConfig } from "next-intl/server";
import { getUserLocale } from "@/libs/i18n";

export default getRequestConfig(async () => {
  const locale = (await getUserLocale()) || "zh-CN";
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
