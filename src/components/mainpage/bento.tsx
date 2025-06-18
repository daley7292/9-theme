import { useTranslations } from "next-intl";
import { BentoCard, BentoGrid } from "../magicui/bento-grid";
import { AnimatedBeamDemo } from "./bento/animatebeam";
import { AnimatedListDemo } from "./bento/animatelist";
import { MarqueeFileDemo } from "./bento/marqueefile";
import { TerminalDemo } from "./bento/terminal";
import { ComponentPropsWithoutRef, ReactNode } from "react";

const bento = [
  {
    name: "",
    description: "",
    icon: "ri:terminal-box-line",
    className: "col-span-3 lg:col-span-2",
    background: <TerminalDemo />,
  },
  {
    name: "",
    description: "",
    icon: "ri:movie-2-line",
    className: "col-span-3 lg:col-span-1",
    background: <AnimatedListDemo />,
  },
  {
    name: "",
    description: "",
    icon: "ri:ai-generate-2",
    className: "col-span-3 lg:col-span-1",
    background: <AnimatedBeamDemo />,
  },
  {
    name: "",
    description: "",
    icon: "ri:more-line",
    className: "col-span-3 lg:col-span-2",
    background: <MarqueeFileDemo />,
  },
];

export const Bento = () => {
  const t = useTranslations();
  return (
    <section>
      <div className="relative container mx-auto px-4 py-16 max-w-6xl">
        <div className="text-center space-y-4 pb-6 mx-auto">
          <h2 className="text-sm text-primary font-mono font-medium tracking-wider uppercase">
            {t("bentoTitle")}
          </h2>
          <h3 className="mx-auto mt-4 max-w-xs text-3xl font-semibold sm:max-w-none sm:text-4xl md:text-5xl">
            {t("bentoDesc")}
          </h3>
          <p className="mt-6 text-lg leading-8 text-slate-600 max-w-2xl mx-auto"></p>
        </div>
        <BentoGrid>
          {bento.map((item, idx) => {
            item.name = t(`bentoContent.${idx + 1}.name`);
            item.description = t(`bentoContent.${idx + 1}.description`);
            return <BentoCard key={idx} {...item} />;
          })}
        </BentoGrid>
      </div>
    </section>
  );
};
