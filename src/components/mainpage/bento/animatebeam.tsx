import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { cn } from "@heroui/react";
import { Icon } from "@iconify/react/dist/iconify.js";
import { forwardRef, useRef } from "react";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-content3 bg-content1 p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
        className
      )}
    >
      {children}
    </div>
  );
});
export const AnimatedBeamDemo = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className="relative flex w-full max-w-[500px] items-center justify-center overflow-hidden p-10
        
        min-w-[100%] absolute -top-0 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_0%,#000_100%)]"
      ref={containerRef}
    >
      <div className="flex size-full max-w-lg flex-row items-stretch justify-between gap-10">
        <div className="flex flex-col justify-center">
          <Circle ref={div1Ref}>
            <Icon icon="ri:user-3-line" width={36} />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div2Ref}>
            <Icon icon="ri:server-line" width={36} className="text-primary" />
          </Circle>
        </div>
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div3Ref}>
            <Icon icon="ri:openai-line" width={36} className="text-[#0b9d7b]" />
          </Circle>
          <Circle ref={div4Ref}>
            <Icon icon="ri:claude-line" width={36} className="text-[#bd5b39]" />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div2Ref}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div3Ref}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div4Ref}
      />
      <AnimatedBeam
        duration={3}
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div5Ref}
      />
    </div>
  );
};
