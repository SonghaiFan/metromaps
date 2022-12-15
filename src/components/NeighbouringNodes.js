import React from "react";
import NeighbouringNode from "./NeighbouringNode";
import { motion } from "framer-motion";

const NEIGHBOURING_NODE_POSITION = {
  LEFT: "left",
  RIGHT: "right",
};

export { NEIGHBOURING_NODE_POSITION };

export default function NeighbouringNodes({
  connectedNodes,
  currentNode,
  screenWidth,
  screenHeight,
  zoomedInArticleWidth,
  onClick,
  onNeighbourNodeLabelClick,
}) {
  const renderWidth = (screenWidth - zoomedInArticleWidth) / 2;

  const { left, right } = connectedNodes.reduce(
    (accumulator, node) => {
      return node.x < currentNode.x
        ? {
            ...accumulator,
            left: accumulator.left.concat(node),
          }
        : {
            ...accumulator,
            right: accumulator.right.concat(node),
          };
    },
    { left: [], right: [] }
  );

  return (
    <motion.div>
      <motion.div
        className="absolute flex flex-col justify-center items-center pointer-events-none"
        style={{ x: 0, width: renderWidth, height: screenHeight }}
      >
        {left.map((node) => {
          return (
            <motion.div
              style={{ height: screenHeight / left.length }}
              className="flex justify-center items-center"
              key={node.id}
            >
              <NeighbouringNode
                data={node}
                onClick={onClick(node.id)}
                currentNode={currentNode}
                position={NEIGHBOURING_NODE_POSITION.LEFT}
                onNeighbourNodeLabelClick={onNeighbourNodeLabelClick}
              />
            </motion.div>
          );
        })}
      </motion.div>
      <motion.div
        className="absolute flex flex-col justify-center items-center pointer-events-none"
        style={{
          x: zoomedInArticleWidth + renderWidth,
          width: renderWidth,
          height: screenHeight,
        }}
      >
        {right.map((node) => {
          return (
            <motion.div
              style={{ height: screenHeight / right.length }}
              className="flex justify-center items-center"
              key={node.id}
            >
              <NeighbouringNode
                data={node}
                onClick={onClick(node.id)}
                currentNode={currentNode}
                position={NEIGHBOURING_NODE_POSITION.RIGHT}
                onNeighbourNodeLabelClick={onNeighbourNodeLabelClick}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </motion.div>
  );
}
