import { string2render } from "@/libs/stringRender";
import { checkPeriod, lowestPrice } from "@/libs/utils";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Chip,
  cn,
  Divider,
} from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useFormatter, useTranslations } from "next-intl";

export const PlanCard = ({
  item,
  onPress,
}: {
  item: PlanData;
  onPress: () => void;
}) => {
  const t = useTranslations();
  const format = useFormatter();
  return (
    <Card
      className={cn(
        "w-full h-full",
        "flex flex-col gap-4 text-start p-6",
        "shadow-small bg-content1 rounded-large",
        (item.capacity_limit === null || item.capacity_limit > 0) && [
          "hover:shadow-md hover:shadow-primary-500/20",
        ]
      )}
      isDisabled={item.capacity_limit !== null && item.capacity_limit <= 0}
      isHoverable={item.capacity_limit === null || item.capacity_limit > 0}
    >
      <div className="w-full mb-2 flex justify-between items-center gap-2">
        <div className="tracking-wider text-md text-primary flex items-center gap-2">
          <div
            className={cn(
              "flex h-8 w-8 min-w-8 items-center justify-center rounded-md",
              "bg-primary-100"
            )}
          >
            <Icon icon="ri:shopping-bag-line" width={20} />
          </div>
          <p className="text-default-500 text-start truncate">{item.name}</p>
        </div>
        {item.capacity_limit != null && item.capacity_limit <= 10 && (
          <Chip
            color={item.capacity_limit > 0 ? "warning" : "danger"}
            className="text-sm text-white"
            radius="sm"
            size="sm"
          >
            {item.capacity_limit > 0
              ? t("shopPlanLeft", { left: item.capacity_limit })
              : t("shopPlanNoLeft")}
          </Chip>
        )}
      </div>
      <div className="text-medium text-default-500">
        {t.rich("shopTrafficEnable", {
          traffic: (chunks) => (
            <span className="font-bold text-primary">
              {item.transfer_enable} GB
            </span>
          ),
        })}
      </div>
      <Divider />
      <CardBody className="gap-8">
        <span className="text-md font-medium text-default-400 tracking-tight text-nowrap">
          {t.rich("shopPrice", {
            price: () => (
              <span className="text-foreground text-4xl font-bold tracking-tight truncate">
                {format.number(lowestPrice(item), {
                  style: "currency",
                  currency: "CNY",
                })}
              </span>
            ),
            period: t(checkPeriod(item)),
          })}
        </span>
      </CardBody>
      <CardFooter className="text-start text-sm min-h-24">
        {string2render(item.content)}
      </CardFooter>
      <Button
        fullWidth
        isDisabled={item.capacity_limit !== null && item.capacity_limit <= 0}
        onPress={onPress}
        radius="lg"
        color="primary"
      >
        {t("shopBuy")}
      </Button>
    </Card>
  );
};
