import { Icon } from "@iconify/react/dist/iconify.js";
import { AnimatePresence, motion } from "framer-motion";

export const PasswordMask = ({
  isVisible,
  onClick,
}: {
  isVisible: boolean;
  onClick: () => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      <button type="button" onClick={onClick}>
        {isVisible ? (
          <motion.div
            key="eye-closed"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className="pointer-events-none text-2xl text-foreground/50"
              icon="ri:eye-off-line"
            />
          </motion.div>
        ) : (
          <motion.div
            key="eye-open"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <Icon
              className="pointer-events-none text-2xl text-foreground/50"
              icon="ri:eye-line"
            />
          </motion.div>
        )}
      </button>
    </AnimatePresence>
  );
};
