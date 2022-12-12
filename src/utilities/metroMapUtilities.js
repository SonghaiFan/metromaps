const METROSTOP_BOTTOM_PADDING = 10;

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

export { metroStopVariantsFactory, METROSTOP_BOTTOM_PADDING };
