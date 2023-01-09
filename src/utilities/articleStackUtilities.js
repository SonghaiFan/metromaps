import {
  ARTICALSTACK_TOP_PADDING,
  ARTICALSTACK_INNER_PADDING,
} from "../utilities/util";

const articleVariantsFactory = (
  totalArticles,
  articleIndex,
  screenWidth,
  screenHeight,
  articleWidth,
  articleHeight,
  zoomedInArticleWidth,
  zoomedInArticleHeight
) => {
  return {
    clicked: {
      width: zoomedInArticleWidth,
      height: zoomedInArticleHeight,
      x: 0,
      y:
        (ARTICALSTACK_INNER_PADDING + zoomedInArticleHeight) *
        (totalArticles - articleIndex - 1),
      duration: 0.1,
      // transition: {
      //   delay: (totalArticles - articleIndex + 1) / 500,
      //   ease: "easeOut",
      // },
    },
    default: {
      width: articleWidth,
      height: articleHeight,
      x: totalArticles - articleIndex - 1,
      y: articleIndex - totalArticles + 1,
      duration: 0.1,
      // transition: {
      //   delay: (totalArticles - articleIndex + 1) / 500,
      //   ease: "easeOut",
      // },
    },
  };
};

export { articleVariantsFactory };
