import React from "react";
import { motion } from "framer-motion";

export default function Article({ article, metroStopClicked }) {
  return (
    <motion.div className="absolute bg-inherit w-full h-full rounded-md">
      <motion.div
        style={{
          fontFamily: "var(--font-serif)",
          color: "var(--primaryDark)",
        }}
      >
        {metroStopClicked && (
          <>
            <motion.div className={"text-2xl p-2 pb-1 line-clamp-2 font-bold"}>
              {article.title}
            </motion.div>
            <motion.div className="p-2 pt-0 pb-1">
              by {article.publisher} on {article.timestamp}
            </motion.div>
            <motion.div className="line-clamp-2 m-2 mt-0">
              {article.text}
            </motion.div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
