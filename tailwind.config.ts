import { heroui } from "@heroui/theme";
import type { Config } from "tailwindcss";

const DEFAULT_COLOR = "#c4161c";
const LIGHT_COLORS = {
  DEFAULT: DEFAULT_COLOR,
    '50': '#fef2f2',
    '100': '#ffe1e2',
    '200': '#ffc8ca',
    '300': '#ffa1a4',
    '400': '#fe6b70',
    '500': '#f63d43',
    '600': '#e41e25',
    '700': '#c4161c',
    '800': '#9e161b',
    '900': '#83191d',
    '950': '#47080a',
};
const getDarkDefault = () => {
  const defaultKey = Object.keys(LIGHT_COLORS).find(
    (key) => LIGHT_COLORS[key as keyof typeof LIGHT_COLORS] === DEFAULT_COLOR
  );
  return defaultKey
    ? LIGHT_COLORS[defaultKey as keyof typeof LIGHT_COLORS]
    : DEFAULT_COLOR;
};
const DARK_COLORS = {
  "50": LIGHT_COLORS["900"],
  "100": LIGHT_COLORS["800"],
  "200": LIGHT_COLORS["700"],
  "300": LIGHT_COLORS["600"],
  "400": LIGHT_COLORS["500"],
  "500": LIGHT_COLORS["400"],
  "600": LIGHT_COLORS["300"],
  "700": LIGHT_COLORS["200"],
  "800": LIGHT_COLORS["100"],
  "900": LIGHT_COLORS["50"],
  DEFAULT: getDarkDefault(),
};

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        "shiny-text": "shiny-text 8s infinite",
        marquee: "marquee var(--duration) linear infinite",
        "marquee-vertical": "marquee-vertical var(--duration) linear infinite",
        orbit: "orbit calc(var(--duration)*1s) linear infinite",
      },
      keyframes: {
        "shiny-text": {
          "0%, 90%, 100%": {
            "background-position": "calc(-100% - var(--shiny-width)) 0",
          },
          "30%, 60%": {
            "background-position": "calc(100% + var(--shiny-width)) 0",
          },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(calc(-100% - var(--gap)))" },
        },
        "marquee-vertical": {
          from: { transform: "translateY(0)" },
          to: { transform: "translateY(calc(-100% - var(--gap)))" },
        },
        orbit: {
          "0%": {
            transform:
              "rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg))",
          },
          "100%": {
            transform:
              "rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc((var(--angle) * -1deg) - 360deg))",
          },
        },
      },
      backgroundImage: {
        "hero-section-title":
          "linear-gradient(91deg, #FFF 32.88%, rgba(0, 0, 0, 0.4) 99.12%)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          // ...
          colors: {
            primary: LIGHT_COLORS,
          },
        },
        dark: {
          // ...
          colors: {
            primary: DARK_COLORS,
          },
        },
      },
      addCommonColors: true,
    }),
  ],
} satisfies Config;
