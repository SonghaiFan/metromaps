import * as d3 from "d3";

// FUNCTIONS
export const timeParse = d3.timeParse("%Y-%m-%d");
export const timeFormat = d3.timeFormat("%d %b %Y");
export const nodesCollided = (node1, node2) => {
  const xDifference = node1.x - node2.x;
  const yDifference = node1.x - node2.x;
  const length = Math.sqrt(
    xDifference * xDifference + yDifference * yDifference
  );
  return length < node1.radius + node2.radius;
};
export const flatMap = (array, mapFunction) => {
  return Array.prototype.concat(...array.map(mapFunction));
};

// CONSTANTS
export const NODEWIDTH = 15;
export const ARTICLE_RADIUS_MULTIPLIER = 0.8;

// metromap container margin
export const margin = { x: 0.05, y: 0.15 };
