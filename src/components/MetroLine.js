import React from "react";
import { motion } from "framer-motion";
import * as utils from "svg-path-reverse";

const METROLINE_WIDTH = 10;
const METROLINE_ANIMATION_DURATION = 2;

export { METROLINE_WIDTH, METROLINE_ANIMATION_DURATION };

const metroLineVariantFactory = {
  hidden: {
    pathLength: 0,
    transition: { duration: METROLINE_ANIMATION_DURATION },
  },
  default: {
    pathLength: 1,
    transition: { duration: METROLINE_ANIMATION_DURATION },
  },
};

export default function MetroLine({
  data,
  strokeWidth,
  reversed,
  onClickToOpenDrawer,
}) {
  const drawPath = (coords) => {
    let res = "";

    // Draws svg path through given coords
    coords.forEach((c, i) => {
      if (i === 0) {
        // first coord
        res += `M ${c.x} ${c.y}`;
      } else {
        const cl = 10; // curve length
        const offset = cl * 2 ** -0.5; // side length after curve
        if (c.start === null) {
          res += ` L ${c.x} ${c.y}`;
        } else {
          res += ` L ${c.x + cl * c.start[0]} ${c.y + cl * c.start[1]}`; // point before curve
          res += ` C ${c.x} ${c.y} ${c.x} ${c.y}`; // control points
          res += ` ${c.x + offset * c.end[0]} ${c.y + offset * c.end[1]}`;
        }
      }
    });

    return reversed ? utils.reverse(res) : res;
  };

  return (
    <>
      {data.map((path, index) => {
        return (
          <motion.g key={index}>
            <motion.path
              data-type="metro-line-path"
              className={"hover: cursor-pointer"}
              id={path.id}
              fill="transparent"
              d={drawPath(path.path)}
              stroke={path.colour}
              strokeWidth={strokeWidth || METROLINE_WIDTH}
              variants={metroLineVariantFactory}
              initial="hidden"
              animate="default"
              onClick={onClickToOpenDrawer}
            />
          </motion.g>
        );
      })}
    </>
  );
}
