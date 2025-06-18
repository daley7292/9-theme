import { locales } from "@/i18n/config";
import { setUserLocale } from "@/libs/i18n";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTransition } from "react";

export const I18NSwitch = () => {
  const [isPending, startTransition] = useTransition();

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          radius="lg"
          isLoading={isPending}
          className="hover:scale-105 transition-transform"
        >
          {isPending ? null : (
            <Icon
              className="text-default-500"
              icon="ri:translate"
              width={24}
            />
          )}
        </Button>
      </DropdownTrigger>
      <DropdownMenu aria-label="Static Actions" variant="faded">
        {locales.map((item) => (
          <DropdownItem
            key={item.key}
            onPress={() =>
              startTransition(() => {
                setUserLocale(item.key);
              })
            }
            className="flex flex-row items-center gap-2 text-default-500"
            startContent={<Icon icon={item.icon} width={16} />}
            variant="faded"
          >
            {item.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
};
