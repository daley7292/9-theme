import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const ThemeSwitch = () => {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const themes = {
    light: "ri:sun-line",
    dark: "ri:moon-line",
    system: "ri:mac-line",
  };

  if (!mounted) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          variant="light"
          isIconOnly
          radius="lg"
          className="hover:scale-105 transition-transform"
        >
          <Icon
            icon={themes[theme as "light" | "dark" | "system"]}
            width={24}
            className="text-default-500"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions">
        {Object.entries(themes).map(([key, value]) => (
          <DropdownItem
            key={key}
            onPress={() => setTheme(key)}
            className="flex flex-row items-center gap-2 text-default-500"
            startContent={<Icon icon={value} width={16} />}
            variant="faded"
          >
            {t("theme." + key)}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
