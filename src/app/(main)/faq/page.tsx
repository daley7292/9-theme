"use client";

import { Accordion, AccordionItem } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { useTranslations } from "next-intl";

export default function Page() {
  const t = useTranslations();
  const faqs = 4;

  return (
    <section
      id="features"
      className="flex flex-col gap-4 justify-center items-center sm:w-2/3"
    >
      <div className="p-4 flex flex-col h-auto text-center gap-6">
        <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            {t("faqTitle")}
          </h1>
          <h2 className="text-md sm:text-lg font-semibold text-default-500">
            {t("faqDesc")}
        </h2>
      </div>
      <Accordion
        fullWidth
        keepContentMounted
        className="gap-3"
        itemClasses={{
          base: "px-6 !bg-content2 hover:!bg-content3 !shadow-none data-[open=true]:!bg-content2",
          title: "font-medium",
          trigger: "py-4 md:py-6",
          content: "pt-0 pb-6 text-base text-default-500",
          indicator: "data-[open=true]:rotate-180",
        }}
        selectionMode="multiple"
        variant="splitted"
      >
        {Array.from({ length: faqs }, (_, index) => (
          <AccordionItem
            key={index}
            indicator={<Icon icon="ri:arrow-drop-down-line" width={24} />}
            title={t("faqContent." + (index + 1) + ".question")}
          >
            {t("faqContent." + (index + 1) + ".answer")}
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
