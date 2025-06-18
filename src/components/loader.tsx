import { cn } from "@heroui/react";

export const Loader = ({ size }: { size?: "sm" | "md" | "lg" }) => (
  <div className="flex flex-row gap-2">
    <div
      className={cn(
        "rounded-full bg-primary-300 animate-bounce",
        "w-6 h-6",
        size === "sm" && "w-4 h-4",
        size === "md" && "w-6 h-6",
        size === "lg" && "w-8 h-8"
      )}
    ></div>
    <div
      className={cn(
        "rounded-full bg-primary-500 animate-bounce [animation-delay:-.3s]",
        "w-6 h-6",
        size === "sm" && "w-4 h-4",
        size === "md" && "w-6 h-6",
        size === "lg" && "w-8 h-8"
      )}
    ></div>
    <div
      className={cn(
        "rounded-full bg-primary-700 animate-bounce [animation-delay:-.5s]",
        "w-6 h-6",
        size === "sm" && "w-4 h-4",
        size === "md" && "w-6 h-6",
        size === "lg" && "w-8 h-8"
      )}
    ></div>
  </div>
);
