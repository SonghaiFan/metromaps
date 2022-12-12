import { INNER_PADDING, TOP_PADDING } from "../utilities/articleStackUtilities";
import { METROSTOP_CIRCLE_SIZE } from "../components/MetroStop";

const nodeWordsVariantsFactory = (
  isMapFocused,
  height,
  screenHeight,
  clickedArticleContainerHeight
) => {
  return {
    default: {
      y: isMapFocused ? height + METROSTOP_CIRCLE_SIZE : 0,
    },
    clicked: {
      y: TOP_PADDING + clickedArticleContainerHeight + INNER_PADDING,
    },
  };
};

export { nodeWordsVariantsFactory };
