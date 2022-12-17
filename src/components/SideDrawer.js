import React from "react";
import { motion } from "framer-motion";
import { margin } from "../utilities/util";
import { METROSTOP_BOTTOM_PADDING } from "../utilities/metroMapUtilities";
import { MAX_ARTICLES } from "../utilities/calculateMetroMapLayout";
import { TIME_AXIS_PADDING } from "./TimeAxis";
import { MdClose } from "react-icons/md";

export const SideDrawer = ({
  isVisible,
  close,
  screenWidth,
  screenHeight,
  paddingY,
  children,
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
          {children}
        </motion.div>
      </>
    )
  );
};
