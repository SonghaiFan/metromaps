import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Timer({ pageState, isValid, onTimeUp }) {
  const timeToCount = pageState.time;
  const [timeLeft, setTimeLeft] = useState(timeToCount);

  useEffect(() => {
    if (timeLeft === 0) {
      return onTimeUp();
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // update timeLeft every second

    return () => {
      clearInterval(interval);
    }; // clear the interval when the component unmounts
  }, [onTimeUp, timeLeft]); // only re-run the effect if timeLeft changes

  useEffect(() => {
    setTimeLeft(pageState.time);
  }, [pageState]);

  const timeLeftPercent = timeLeft / pageState.time;
  // const timeLeftPercentString = ((1 - timeLeftPercent) * 100).toFixed(0) + "%";
  const timeUsedPercentString = ((1 - timeLeftPercent) * 100).toFixed(0) + "%";

  function ease(x) {
    return x * x * x;
  }

  // console.log(ease(1 - timeLeftPercent));

  return (
    <AnimatePresence>
      {isValid && (
        <motion.div className="fixed w-2 h-full  rounded-full ">
          <motion.div
            className="bg-white break-normal w-2 text-black text-xs font-medium p-0.5 leading-none rounded-b-full"
            animate={{
              height: timeUsedPercentString,
              opacity: ease(1 - timeLeftPercent),
            }}
            transition={{ duration: 1, ease: "linear" }}
          >
            {/* <h1>{`Totoal Time: ${pageState.time};timeLeft: ${timeLeft} (${timeLeftPercentString})`}</h1> */}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
