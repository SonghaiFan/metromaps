const TOP_PADDING = 50;
const INNER_PADDING = 20;

export { TOP_PADDING, INNER_PADDING };

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
        (INNER_PADDING + zoomedInArticleHeight) *
        (totalArticles - articleIndex - 1),
      transition: {
        delay: (totalArticles - articleIndex + 1) / 500,
        ease: "easeOut",
      },
    },
    default: {
      width: articleWidth,
      height: articleHeight,
      x: totalArticles - articleIndex - 1,
      y: articleIndex - totalArticles + 1,
      transition: {
        delay: (totalArticles - articleIndex + 1) / 500,
        ease: "easeOut",
      },
    },
  };
};

export { articleVariantsFactory };
