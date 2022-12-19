import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const TOTAL_TIME = 20;

export default function Timer({ setPageState, resetZoom, ended, counted }) {
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME); // initial time is 1 minute (60 seconds)

  //  stop the timer when "whenStopped" is true

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // update timeLeft every second

    return () => clearInterval(interval); // clear the interval when the component unmounts
  }, [timeLeft]); // only re-run the effect if timeLeft changes

  if (timeLeft === 0) {
    setTimeLeft(TOTAL_TIME);
    if (!ended && !counted) {
      setPageState();
      resetZoom();
    }
  }

  const timeLeftPercent = timeLeft / TOTAL_TIME;

  return (
    <AnimatePresence>
      {!ended && !counted && (
        <motion.div className="w-full bg-black rounded-full h-2.5 dark:bg-gray-700">
          <motion.div
            className="bg-white h-2 rounded-full"
            animate={{
              width: `${(timeLeftPercent * 100).toFixed(2)}%`,
              opacity: 1,
              //   timeLeft < TOTAL_TIME * 0.5 ? 1 - timeLeftPercent : 0,
              //   backgroundColor: timeLeftPercent < 0.2 ? "red" : "white",
            }}
            transition={{ duration: 1, ease: "linear" }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
