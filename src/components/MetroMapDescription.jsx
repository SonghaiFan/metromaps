import React from "react";
import { motion } from "framer-motion";

function MetroMapDescription({
  isDisplayed,
  description,
  subtitle,
  hint,
  height,
  time,
}) {
  return (
    <>
      {isDisplayed && (
        <motion.div
          style={{ maxHeight: height }}
          // className="overflow-y-auto scrollbar"
          className="mx-[25%]"
        >
          <motion.div
            className="px-8 py-1 text-lg line-clamp-3 lg:line-clamp-5 xl:line-clamp-none font-bold italic"
            initial={{
              opacity: "0",
              height: "100%",
              width: "100%",
            }}
            animate={{
              opacity: "1",
              height: "100%",
              width: "100%",
            }}
          >
            {subtitle}
          </motion.div>
          <motion.div
            className="px-8 py-1 text-base line-clamp-3 lg:line-clamp-5 xl:line-clamp-none"
            initial={{
              opacity: "0",
              height: "100%",
              width: "100%",
            }}
            animate={{
              opacity: "1",
              height: "100%",
              width: "100%",
            }}
          >
            {description}
          </motion.div>
          <motion.div
            className="px-8 py-1 text-s line-clamp-3 lg:line-clamp-5 xl:line-clamp-none italic"
            initial={{
              opacity: "0",
              height: "100%",
              width: "100%",
            }}
            animate={{
              opacity: "1",
              height: "100%",
              width: "100%",
            }}
            style={{ color: "#ffb121" }}
          >
            {`The time for this session is ${time} seconds.`}
          </motion.div>
        </motion.div>
      )}
    </>
  );
}

export default MetroMapDescription;
