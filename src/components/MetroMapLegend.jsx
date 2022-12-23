import React from "react";
import { motion } from "framer-motion";
import { colours } from "../utilities/calculateMetroMapLayout";

function MetroMapLegend({ isDisplayed, style, initial, animate }) {
  const background = colours
    .reduce(
      (gradientString, colour, i, colourList) =>
        gradientString.concat(
          `${colour} ${(i / (colourList.length - 1)) * 100}%, `
        ),
      "linear-gradient(90deg, "
    )
    .slice(0, -2)
    .concat(")");

  return (
    <>
      {isDisplayed && (
        <motion.div
          style={style || { background }}
          initial={initial}
          animate={animate}
          className="absolute rounded-full flex justify-between items-center z-40"
        >
          <div className="ml-2 text-sm">{"<- Weaker Connections"}</div>
          <div className="mr-2 text-sm" style={{ color: "var(--primaryDark)" }}>
            {"Stronger Connections ->"}
          </div>
        </motion.div>
      )}
    </>
  );
}

export default MetroMapLegend;
