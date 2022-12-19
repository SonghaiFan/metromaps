import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { METROMAPS_LENGTH, METROMAPS_TIME } from "../utilities/metromaps";

const TOTAL_TIME = 20;

export default function Timer({
  pageState,
  setPageState,
  resetZoom,
  ended,
  counted,
}) {
  const [timeLeft, setTimeLeft] = useState(METROMAPS_TIME[0]);
  //  stop the timer when "whenStopped" is true

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // update timeLeft every second

    return () => {
      clearInterval(interval);
      if (timeLeft === 0) {
        setTimeLeft(pageState.time);
      }
    }; // clear the interval when the component unmounts
  }, [pageState.time, timeLeft]); // only re-run the effect if timeLeft changes

  useEffect(() => {
    setTimeLeft(pageState.time);
    return () => {};
  }, [pageState]);

  const timerNextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, Math.max(...oldPageState.hist) + 1), // move to next page after the farthest page in hist
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: 1,
      time: METROMAPS_TIME[
        Math.min(oldPageState.total - 1, Math.max(...oldPageState.hist))
      ],
    };
  };

  if (timeLeft === 0) {
    if (!ended && !counted) {
      resetZoom();
      setPageState(timerNextPageState(pageState));
    }
  }

  const timeLeftPercent = timeLeft / pageState.time;

  return (
    <AnimatePresence>
      {!ended && !counted && (
        <motion.div className="fixed w-full bg-balck rounded-full dark:bg-gray-700">
          <motion.div
            className="bg-white text-xs font-medium text-blue-100 text-center p-0.5 leading-none rounded-full"
            animate={{
              width: `${(timeLeftPercent * 100).toFixed(2)}%`,
              opacity: 1 - timeLeftPercent,
              backgroundColor: timeLeftPercent < 0.2 ? "red" : "white",
            }}
            transition={{ duration: 1, ease: "linear" }}
          ></motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
