import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Timer({ pageState, isValid, isStop, onTimeUp }) {
  const timeToCount = pageState.time;
  const [timeLeft, setTimeLeft] = useState(timeToCount);
  const [hasAlerted, setHasAlerted] = useState(false);

  const timeLeftPercent = timeLeft / pageState.time;
  const timeLeftPercentString = (timeLeftPercent * 100).toFixed(0) + "%";
  // const timeUsedPercentString = ((1 - timeLeftPercent) * 100).toFixed(0) + "%";

  // function ease(x) {
  //   return x * x * x;
  // }

  // console.log(ease(1 - timeLeftPercent));

  // console.log(`timeLeft: ${timeLeft}`);

  useEffect(() => {
    if (timeLeft === 0) {
      return onTimeUp();
    }

    if (!hasAlerted && isValid && timeLeftPercent === 0.2) {
      setHasAlerted(true);
      alert("Time is closing!");
    }

    if (isStop) {
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000); // update timeLeft every second

    return () => {
      clearInterval(interval);
    }; // clear the interval when the component unmounts
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]); // only re-run the effect if timeLeft changes

  useEffect(() => {
    setTimeLeft(pageState.time);
  }, [pageState]);

  return (
    <AnimatePresence>
      {isValid && (
        <motion.div
          className="fixed w-full h-2 rounded-full "
          style={{
            color: timeLeftPercent < 0.2 ? "red" : "white",
          }}
        >
          <h1>{`Time Remaining: (${timeLeftPercentString})`}</h1>
        </motion.div>
        // <motion.div className="fixed w-2 h-full  rounded-full ">
        //   <motion.div
        //     className="bg-white break-normal w-2 text-black text-xs font-medium p-0.5 leading-none rounded-b-full"
        //     animate={{
        //       height: timeLeftPercentString,
        //       opacity: ease(1 - timeLeftPercent),
        //     }}
        //     transition={{ duration: 1, ease: "linear" }}
        //   ></motion.div>
        // </motion.div>
      )}
    </AnimatePresence>
  );
}
