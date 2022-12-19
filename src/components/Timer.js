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
  }, [pageState, resetZoom, setPageState, timeLeft]); // only re-run the effect if timeLeft changes

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
      {
        // !ended && !counted && (
        <h1>{`totoalTime: ${pageState.time};timeLeft: ${timeLeft}`}</h1>
        // )
        // <motion.div className="w-full bg-black rounded-full h-2.5 dark:bg-gray-700">
        //   <motion.div
        //     className="bg-white h-2 rounded-full"
        //     animate={{
        //       width: `${(timeLeftPercent * 100).toFixed(2)}%`,
        //       opacity: 1,
        //       //   timeLeft < TOTAL_TIME * 0.5 ? 1 - timeLeftPercent : 0,
        //       //   backgroundColor: timeLeftPercent < 0.2 ? "red" : "white",
        //     }}
        //     transition={{ duration: 1, ease: "linear" }}
        //   ></motion.div>
        // </motion.div>
      }
    </AnimatePresence>
  );
}
