import { AnimatePresence, domAnimation, LazyMotion, m } from "framer-motion";
import { Marquee } from "../magicui/marquee";
import { Button, cn, Link } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import RotatingText from "../reactbits/RotatingText";
import { useTranslations } from "next-intl";
import { useAuth } from "@/libs/auth";

const companies = [
  "Google",
  "Microsoft",
  "Amazon",
  "Netflix",
  "YouTube",
  "Instagram",
  "Uber",
  "Spotify",
];

export const Hero = () => {
  const { remoteConfig } = useAuth();
  const t = useTranslations();
  const keys = 5;
  return (
    <section
      id="main"
      className={cn(
        "flex flex-col items-center justify-center",
        "rounded-large w-full",
        "z-20 px-4 pb-4 h-[calc(100vh-180px)]"
      )}
    >
      <LazyMotion features={domAnimation}>
        <m.div
          key="1"
          animate="kick"
          className="flex flex-col gap-6"
          exit="auto"
          initial="auto"
          transition={{
            duration: 0.25,
            ease: "easeInOut",
          }}
          variants={{
            auto: { width: "auto" },
            kick: { width: "auto" },
          }}
        >
          <AnimatePresence mode="popLayout">
            <m.div
              animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
              className="text-center text-[clamp(40px,10vw,44px)] font-bold leading-[1.2] tracking-tighter sm:text-[64px]"
              initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 2 }}
              transition={{
                bounce: 0,
                delay: 0.01 * 10,
                duration: 0.8 + 0.1 * 8,
                type: "spring",
              }}
            >
              <div className="text-foreground">
                <RotatingText
                  texts={Array.from({ length: keys }).map((_, index) =>
                    t(`heroRotate.${index + 1}`)
                  )}
                  mainClassName="w-full flex items-center justify-center"
                  staggerFrom="last"
                  staggerDuration={0.05}
                  splitLevelClassName=""
                  rotationInterval={2000}
                />
                {t("heroTitle2")}
              </div>
            </m.div>

            <m.div
              key="2"
              animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
              className="text-center font-normal leading-7 text-default-500 sm:w-[466px] sm:text-[18px]"
              initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 3 }}
              transition={{
                bounce: 0,
                delay: 0.01 * 30,
                duration: 0.8 + 0.1 * 9,
                type: "spring",
              }}
            >
              {t("heroDesc", { site: remoteConfig.app_name })}
            </m.div>
            <m.div
              key="3"
              animate={{ filter: "blur(0px)", opacity: 1, x: 0 }}
              className="flex flex-col gap-3 sm:flex-row justify-center items-center sm:gap-6"
              initial={{ filter: "blur(16px)", opacity: 0, x: 15 + 1 * 4 }}
              transition={{
                bounce: 0,
                delay: 0.01 * 50,
                duration: 0.8 + 0.1 * 10,
                type: "spring",
              }}
            >
              <Button
                as={Link}
                href="/shop"
                color="primary"
                className="h-10 w-[163px] px-[16px] py-[10px] text-small font-medium leading-5"
                radius="lg"
              >
                {t("heroBuy")}
              </Button>
              <Button
                onPress={(e) => {
                  const target = document.querySelector("#features");
                  if (target) {
                    target.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
                className="h-10 w-[163px] border-default-100 px-[16px] py-[10px] text-small font-medium leading-5"
                endContent={
                  <span className="pointer-events-none flex h-[22px] w-[22px] items-center justify-center rounded-full bg-default-100">
                    <Icon
                      className="text-default-500 [&>path]:stroke-[1.5]"
                      icon="solar:arrow-right-linear"
                      width={16}
                    />
                  </span>
                }
                radius="lg"
                variant="bordered"
              >
                {t("heroLearn")}
              </Button>
            </m.div>
          </AnimatePresence>
        </m.div>
      </LazyMotion>

      <div className="pt-20 sm:pt-40">
        <div className="container mx-auto px-4 md:px-8">
          <h3 className="text-center text-sm font-semibold text-gray-500">
            {t("heroPartner")}
          </h3>
          <div className="relative mt-6">
            <Marquee className="max-w-full [--duration:40s]">
              {companies.map((logo, idx) => (
                <img
                  key={idx}
                  src={`https://cdn.magicui.design/companies/${logo}.svg`}
                  className="h-10 w-28"
                  alt={logo}
                />
              ))}
            </Marquee>
          </div>
        </div>
      </div>
    </section>
  );
};
