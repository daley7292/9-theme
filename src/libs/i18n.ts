"use server";

import { locales, Locale, defaultLocale } from "@/i18n/config";
import { cookies, headers } from "next/headers";

const COOKIE_NAME = "I18N";
export const getUserLocale = async () => {
  if ((await cookies()).get(COOKIE_NAME)?.value)
    return (await cookies()).get(COOKIE_NAME)?.value;
  const acceptLang = (await headers()).get("Accept-Language");
  if (acceptLang) {
    const languages = acceptLang.split(",").map((lang) => {
      // Extract the language code and remove any quality value (e.g., ";q=0.8")
      const [languageCode] = lang.split(";");
      return languageCode.trim();
    });
    const validLocales = new Set(locales.map((locale) => locale.key));
    const supportedLanguages = languages.filter((lang) =>
      validLocales.has(lang as Locale)
    );
    if (supportedLanguages.length > 0) {
      return supportedLanguages[0];
    }
  }
  return defaultLocale;
};
export const setUserLocale = async (locale: Locale) => {
  (await cookies()).set(COOKIE_NAME, locale);
};
