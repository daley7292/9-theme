import { AnimatedList } from "@/components/magicui/animated-list";
import { cn } from "@heroui/react";
import { useTranslations } from "next-intl";

const notifications = [
  {
    name: "",
    description: "",
    time: "",
    icon: "👤",
    color: "#FFB800",
  },
  {
    name: "",
    description: "",
    time: "",
    icon: "⛰️",
    color: "#1E86FF",
  },
  {
    name: "",
    description: "",
    time: "",
    icon: "🎬",
    color: "#FF3D71",
  },
];
const Notification = ({
  name,
  description,
  icon,
  color,
  time,
}: {
  name: string;
  description: string;
  icon: string;
  color: string;
  time: string;
}) => {
  return (
    <figure
      className={cn(
        "relative mx-auto min-h-fit w-full max-w-[400px] cursor-pointer overflow-hidden rounded-2xl p-4",
        // animation styles
        "transition-all duration-200 ease-in-out hover:scale-[103%]",
        // light styles
        "bg-white [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)]",
        // dark styles
        "transform-gpu dark:bg-transparent dark:backdrop-blur-md dark:[border:1px_solid_rgba(255,255,255,.1)] dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]"
      )}
    >
      <div className="flex flex-row items-center gap-3">
        <div
          className="flex size-10 items-center justify-center rounded-2xl"
          style={{
            backgroundColor: color,
          }}
        >
          <span className="text-lg">{icon}</span>
        </div>
        <div className="flex flex-col overflow-hidden">
          <figcaption className="flex flex-row items-center whitespace-pre text-lg font-medium dark:text-white ">
            <span className="text-sm sm:text-lg">{name}</span>
            <span className="mx-1">·</span>
            <span className="text-xs text-gray-500">{time}</span>
          </figcaption>
          <p className="text-sm font-normal dark:text-white/60">
            {description}
          </p>
        </div>
      </div>
    </figure>
  );
};
export const AnimatedListDemo = () => {
  const t = useTranslations();
  return (
    <AnimatedList className="min-w-[100%] absolute top-0 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
      {notifications.map((item, idx) => {
        item.name = t("bentoList." + (idx + 1) + ".name");
        item.time = t("bentoListTimer");
        item.description = t("bentoList." + (idx + 1) + ".description");
        return <Notification {...item} key={idx} />;
      })}
    </AnimatedList>
  );
};
