"use client";

import { cn } from "@heroui/react";
import { motion } from "framer-motion";

export default function Transition({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      className={cn(
        "w-full max-w-sm flex flex-col items-center",
        "gap-4 p-8 sm:bg-content1 sm:rounded-large sm:shadow-large"
      )}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
    >
      {children}
    </motion.div>
  );
}
