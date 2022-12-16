import React from "react";
import { motion } from "framer-motion";
import { margin } from "../utilities/util";
import { METROSTOP_BOTTOM_PADDING } from "../utilities/metroMapUtilities";
import { MAX_ARTICLES } from "../utilities/calculateMetroMapLayout";
import { TIME_AXIS_PADDING } from "./TimeAxis";
import { MdClose } from "react-icons/md";
import { interpolateRgb } from "d3-interpolate";

const cutomerInterpolation = interpolateRgb("#48a49e", "#fce554");

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  paddingY,
  whoOpenSideDrawer,
}) => {
  return (
    isVisible && (
      <>
        <motion.div
          className="absolute w-screen h-screen z-50"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
          onClick={close}
        />
        <motion.div
          className="absolute right-0 flex items-center justify-center bg-black z-50"
          animate={{ width: screenWidth / 3, height: screenHeight }}
        >
          <motion.button
            className="absolute top-0 right-0 flex justify-center items-center text-4xl"
            animate={{
              width: margin.x * screenWidth,
              height:
                paddingY -
                METROSTOP_BOTTOM_PADDING -
                MAX_ARTICLES -
                TIME_AXIS_PADDING,
            }}
            onClick={close}
          >
            <MdClose />
          </motion.button>
          <motion.div className="text-2xl">
            {/* range slider with five step, label is very high, high, moderate, weak, very weak */}
            <motion.div className="text-2xl">
              Please rate the degree of relevance
            </motion.div>
            <motion.input
              type="range"
              className="w-full h-3 bg-gray-70 rounded-lg appearance-none cursor-pointer range-lg bg-gradient-to-r from-[#585d91] via-[#48a49e] to-[#fce554]"
              min="0"
              max="1"
              step="0.25"
              list="tickmarks"
              onChange={(event) => {
                console.log("in the drawer: ", whoOpenSideDrawer);

                const idData = whoOpenSideDrawer.id.split("-");

                if (idData[0] === "plabel") {
                  const [type, start, end] = idData;
                  console.log(
                    `this is a label for path start with ${start} and end with ${end}`
                  );
                  // query the dom element with id `path-${start}-${end}`
                  const path = document.getElementById(`path-${start}-${end}`);
                  path.style.stroke = cutomerInterpolation(event.target.value);

                  whoOpenSideDrawer.style.backgroundColor =
                    cutomerInterpolation(event.target.value);
                }

                // setLinesShown(event.target.value);
                // updateMetroMapLineShown(event.target.value);
                // handleLineFiltering(event.target.value);
              }}
            />
            <motion.datalist id="tickmarks" className="felex flex-col ">
              <option>Very high</option>
              <option>High</option>
              <option>Moderate</option>
              <option>Weak</option>
              <option>Very weak</option>
            </motion.datalist>
            <motion.div className="w-full flex justify-between text-xs px-2">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </motion.div>
            <motion.div className="w-full flex justify-between text-xs px-2">
              <span>Very weak</span>
              <span>Weak</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very high</span>
            </motion.div>
          </motion.div>
        </motion.div>
      </>
    )
  );
};
