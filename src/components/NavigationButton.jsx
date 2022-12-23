import React from "react";
import { buttonVariants } from "../utilities/buttonAnimation";
import { AnimatePresence, motion } from "framer-motion";

export default function NavigationButton({
  children,
  onClick,
  className,
  isVisible,
}) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          className={`absolute bg-transparent rounded ${className}`}
          onClick={onClick}
          variants={buttonVariants}
          initial="hidden"
          animate="entry"
          exit="hidden"
        >
          {children}
        </motion.button>
      )}
    </AnimatePresence>
  );
}
