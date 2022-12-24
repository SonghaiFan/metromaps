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
const NODEWIDTH = 15;
const ARTICLE_RADIUS_MULTIPLIER = 0.8;

const TOP_FULL_PAGE_PADDING = 20;
const MAX_ARTICLES = 20;

const METROMAPS_PER_PAGE = 1; //Do not change this value
const HEADER_HEIGHT = 80;

const PAGE_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

const METROLINE_WIDTH = 10;
const METROLINE_ANIMATION_DURATION = 2;

const METROSTOP_CIRCLE_SIZE = METROLINE_WIDTH * 2;

const TIME_AXIS_PADDING = 10;

const LINK_LABEL_HEIGHT = 20;

const METROSTOP_BOTTOM_PADDING = 10;

const ARTICALSTACK_TOP_PADDING = 50;
const ARTICALSTACK_INNER_PADDING = 20;

export {
  NODEWIDTH,
  ARTICLE_RADIUS_MULTIPLIER,
  TOP_FULL_PAGE_PADDING,
  MAX_ARTICLES,
  METROMAPS_PER_PAGE,
  HEADER_HEIGHT,
  PAGE_DIRECTION,
  METROLINE_WIDTH,
  METROLINE_ANIMATION_DURATION,
  METROSTOP_CIRCLE_SIZE,
  TIME_AXIS_PADDING,
  LINK_LABEL_HEIGHT,
  METROSTOP_BOTTOM_PADDING,
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
};

// metromap container margin
export const margin = { x: 0.05, y: 0.15 };

export const colours = ["#585d91", "#48a49e", "#fce554"];

export const cutomerInterpolation = (Weight) => {
  const ind = Weight * (colours.length - 1);
  const colour1 = colours[Math.floor(ind)];
  const colour2 = colours[Math.ceil(ind)];
  return d3.interpolateRgb(colour1, colour2)(ind - Math.floor(ind));
};
