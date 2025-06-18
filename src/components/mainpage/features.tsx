import { cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

export const Features = () => {
  const t = useTranslations();
  const features = 3;
  return (
    <section id="features">
      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">
            {t("featuresTitle")}
          </h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            {t("featuresDesc")}
          </h3>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto"></p>
        </div>
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {Array.from({ length: features }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "flex flex-col gap-4 items-center text-center",
                "p-6 rounded-large shadow-small bg-content1",
                "hover:scale-105 hover:shadow-md hover:shadow-primary-500/20",
                "transition-transform duration-300 ease-in-out"
              )}
            >
              <Icon
                icon={t("featuresContent." + (index + 1) + ".icon")}
                width={36}
                className="p-2 rounded-lg bg-primary-400 text-background"
              />
              <h4 className="text-xl font-semibold">
                {t("featuresContent." + (index + 1) + ".title")}
              </h4>
              <p className="text-lg leading-7 text-slate-600">
                {t("featuresContent." + (index + 1) + ".description")}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
