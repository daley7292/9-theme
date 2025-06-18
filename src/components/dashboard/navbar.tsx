import { I18NSwitch } from "@/components/i18nSwitch";
import { ThemeSwitch } from "@/components/themeSwitch";
import { sidebar } from "./sidebar";
import { Button } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";
import { AvatarButton } from "../avatarButton";

const getSidebarItemKey = (pathname: string): string | null => {
  for (const section of sidebar) {
    for (const item of section.items) {
      if (item.href === pathname) {
        return item.key;
      }
    }
  }
  return null;
};
export const Navbar = ({
  pathName,
  onPress,
}: {
  pathName: string;
  onPress: () => void;
}) => {
  const t = useTranslations();
  return (
    <nav className="sticky top-0 flex flex-row px-8 py-4 justify-between items-center z-50 backdrop-blur-lg">
      <div className="flex flex-row gap-2 justify-center items-center">
        <Button
          isIconOnly
          variant="light"
          className="md:hidden"
          onPress={onPress}
        >
          <Icon icon="ri:menu-line" width={24} />
        </Button>
        <span className="text-xl font-bold text-primary-900 uppercase">
          {t(getSidebarItemKey(pathName))}
        </span>
      </div>
      <div className="flex flex-row gap-2 justify-center items-center">
        <I18NSwitch />
        <ThemeSwitch />
        <AvatarButton />
      </div>
    </nav>
  );
};
