import {
  METROSTOP_CIRCLE_SIZE,
  METROSTOP_BOTTOM_PADDING,
  ARTICALSTACK_INNER_PADDING,
  ARTICALSTACK_TOP_PADDING,
} from "../utilities/util";
// TOP_MARGIN
const nodeWordsVariantsFactory = (
  isMapFocused,
  height,
  screenHeight,
  clickedArticleContainerHeight
) => {
  return {
    default: {
      y: isMapFocused ? height + METROSTOP_CIRCLE_SIZE - 40 : 0,
      x: -10,
    },
    clicked: {
      y:
        ARTICALSTACK_TOP_PADDING +
        clickedArticleContainerHeight +
        ARTICALSTACK_INNER_PADDING,
    },
  };
};

export { nodeWordsVariantsFactory };

const metroStopVariantsFactory = (
  screenWidth,
  screenHeight,
  isMapFocused,
  node,
  landingX,
  landingY,
  landingWidth,
  landingHeight,
  paddingX,
  paddingY,
  nodeWidth,
  nodeHeight
) => {
  return {
    clicked: {
      x: 0,
      y: 0,
      width: screenWidth,
      height: screenHeight,
      zIndex: 50,
      transition: { ease: "easeOut" },
    },
    default: {
      x: (isMapFocused ? node.x : landingX) + paddingX,
      y:
        (isMapFocused ? node.y - METROSTOP_BOTTOM_PADDING : landingY) +
        paddingY,
      width: isMapFocused ? nodeWidth : landingWidth,
      height: isMapFocused ? nodeHeight : landingHeight,
      zIndex: 0,
      transition: { ease: "easeOut", when: "afterChildren" },
    },
  };
};

export { metroStopVariantsFactory };
