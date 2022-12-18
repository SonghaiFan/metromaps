import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { margin } from "../utilities/util";
import { METROSTOP_BOTTOM_PADDING } from "../utilities/metroMapUtilities";
import { MAX_ARTICLES } from "../utilities/calculateMetroMapLayout";
import { TIME_AXIS_PADDING } from "./TimeAxis";
import { MdClose } from "react-icons/md";
import { interpolateRgb } from "d3-interpolate";

const colours = ["#585d91", "#48a49e", "#fce554"];

const cutomerInterpolation = (Weight) => {
  const ind = Weight * (colours.length - 1);
  const colour1 = colours[Math.floor(ind)];
  const colour2 = colours[Math.ceil(ind)];
  return interpolateRgb(colour1, colour2)(ind - Math.floor(ind));
};

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  paddingY,
  whoOpenSideDrawer,
  handleCustomNodes,
  handleCustomLines,
}) => {
  const drawerWidth = screenWidth;
  const drawerHeight = screenHeight / 4;
  // check if whoOpenSideDrawer dom element is on top half of the screen
  const isOnTopHalf = whoOpenSideDrawer
    ? whoOpenSideDrawer.getBoundingClientRect().top < screenHeight / 2
    : false;

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          <motion.div
            className="absolute w-screen h-screen bg-black z-50"
            style={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            onClick={close}
            transition={{ duration: 0.2 }}
          />
          <motion.div
            className={
              isOnTopHalf
                ? `absolute bottom-0  flex items-center justify-center bg-black z-50`
                : `absolute top-0 flex items-center justify-center bg-black z-50`
            }
            style={{ width: drawerWidth }}
            animate={{ height: drawerHeight }}
            exit={{ height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              className="absolute top-0 right-0 flex justify-center items-center text-4xl"
              animate={{
                width: margin.x * screenWidth,
                height: 80,
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

                  const newColour = cutomerInterpolation(event.target.value);

                  const type = whoOpenSideDrawer.dataset.type;
                  console.log("type", type);
                  const whoId = whoOpenSideDrawer.id;
                  console.log("whoId", whoId);

                  if (type === "metro-line-label") {
                    console.log(`this is a metro line label at ${whoId}`);
                    handleCustomLines(whoId, newColour);
                  }

                  if (
                    type === "node-words-label" ||
                    type === "neighbour-node-label"
                  ) {
                    console.log(`this is a node word label at ${whoId}`);
                    handleCustomNodes(whoId, newColour);
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
      )}
    </AnimatePresence>
  );
};
