import { site } from "../../config";

export type Locale = (typeof locales)[number]["key"];
export const defaultLocale: Locale = "zh-CN";
export const locales = site.locales;
