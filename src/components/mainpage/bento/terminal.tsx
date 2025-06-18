import {
  AnimatedSpan,
  Terminal,
  TypingAnimation,
} from "@/components/magicui/terminal";
import { useAuth } from "@/libs/auth";
export const TerminalDemo = () => {
  const { remoteConfig } = useAuth();
return (
  <Terminal className="min-w-[100%] absolute top-0 [--duration:20s] [mask-image:linear-gradient(to_top,transparent_40%,#000_100%)] ">
    <TypingAnimation>&gt; bunx create-next-app@latest</TypingAnimation>

    <AnimatedSpan delay={1500}>
      <span>
        <span className="text-green-500">
          ✔<span className="font-bold"> What is your project named? </span>
        </span>
        <span>{remoteConfig.app_name}</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={2000}>
      <span>
        <span className="text-green-500">
          ✔
          <span className="font-bold"> Would you like to use TypeScript? </span>
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={2500}>
      <span>
        <span className="text-green-500">
          ✔<span className="font-bold"> Would you like to use ESLint? </span>
        </span>
        <span className="underline text-cyan-500">No</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={3000}>
      <span>
        <span className="text-green-500">
          ✔
          <span className="font-bold">
            {" "}
            Would you like to use Tailwind CSS?{" "}
          </span>
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={3500}>
      <span>
        <span className="text-green-500">
          ✔
          <span className="font-bold">
            {" "}
            Would you like your code inside a `src/` directory?{" "}
          </span>
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={4000}>
      <span>
        <span className="text-green-500">✔</span>
        <span className="font-bold">
          {" "}
          Would you like to use App Router? (recommended){" "}
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={4500}>
      <span>
        <span className="text-green-500">
          ✔
          <span className="font-bold">
            {" "}
            Would you like to use Turbopack for `next dev`?{" "}
          </span>
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <AnimatedSpan delay={5000}>
      <span>
        <span className="text-green-500">
          ✔
          <span className="font-bold">
            {" "}
            Would you like to customize the import alias (`@/*` by default)?{" "}
          </span>
        </span>
        <span className="underline text-cyan-500">Yes</span>
      </span>
    </AnimatedSpan>

    <TypingAnimation delay={5500} className="text-green-500">
      Creating a new Next.js app.
    </TypingAnimation>
  </Terminal>
)}
