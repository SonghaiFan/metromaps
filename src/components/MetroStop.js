import React from "react";
import { motion } from "framer-motion";
import ArticleStack from "./ArticleStack";
import { nodeWordsVariantsFactory } from "../utilities/metroStopUtilities";
import { useWindowSize } from "react-use";
import { INNER_PADDING } from "../utilities/articleStackUtilities";
import { METROLINE_WIDTH } from "./MetroLine";
import NeighbouringNodes from "./NeighbouringNodes";

const METROSTOP_CIRCLE_SIZE = METROLINE_WIDTH * 2;
const EXCLUDED_TITLES = ["herald sun", "opinion"];

export { METROSTOP_CIRCLE_SIZE };

export default function MetroStop({
  data,
  shouldRenderContent,
  isMapFocused,
  height,
  width,
  articles,
  onClick,
  clicked,
  onNeighbouringNodeClick,
  onArticleStackAnimationComplete,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  const content = data.node_words.length > 0 ? data.node_words[0] : "";

  const ARTICLE_SIZE_MULTIPLIER = 1.25;
  const ARTICLE_HEIGHT =
    (screenHeight / 18) * (clicked ? 1 : ARTICLE_SIZE_MULTIPLIER);
  const ARTICLE_WIDTH =
    (screenWidth / 13) * (clicked ? 1 : ARTICLE_SIZE_MULTIPLIER);
  const ZOOMED_IN_ARTICLE_HEIGHT = 3 * ARTICLE_HEIGHT;
  const ZOOMED_IN_ARTICLE_WIDTH = 8 * ARTICLE_WIDTH;
  const ARTICLE_LIMIT = 4;
  const CLICKED_ARTICLE_CONTAINER_HEIGHT =
    ZOOMED_IN_ARTICLE_HEIGHT * ARTICLE_LIMIT +
    INNER_PADDING * (ARTICLE_LIMIT - 1);

  // filter out title such as Herald Sun
  const { title } = articles.find(
    (article) => !EXCLUDED_TITLES.includes(article.title.toLowerCase())
  );

  return (
    <>
      {clicked && (
        <NeighbouringNodes
          connectedNodes={data.connectedNodes}
          currentNode={data}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          zoomedInArticleWidth={ZOOMED_IN_ARTICLE_WIDTH}
          onClick={onNeighbouringNodeClick}
        />
      )}
      {isMapFocused && (
        <>
          <ArticleStack
            articles={articles}
            colour={data.colour}
            onClick={onClick}
            clicked={clicked}
            clickedArticleContainerHeight={CLICKED_ARTICLE_CONTAINER_HEIGHT}
            zoomedInArticleWidth={ZOOMED_IN_ARTICLE_WIDTH}
            zoomedInArticleHeight={ZOOMED_IN_ARTICLE_HEIGHT}
            articleWidth={ARTICLE_WIDTH}
            articleHeight={ARTICLE_HEIGHT}
            articleLimit={ARTICLE_LIMIT}
            onAnimationComplete={onArticleStackAnimationComplete}
          />
          {!clicked && (
            <motion.div
              style={{
                fontFamily: "var(--font-serif)",
                color: "var(--primaryDark)",
              }}
              className={"absolute text-sm m-1 line-clamp-2 font-bold "}
              onClick={onClick}
            >
              {title}
            </motion.div>
          )}
        </>
      )}
      <motion.div
        style={{
          backgroundColor: isMapFocused
            ? clicked
              ? "rgba(0, 0, 0, 0.8)"
              : "rgba(0, 0, 0, 0)"
            : data.colour,
        }}
        className={`w-full h-full text-black truncate flex justify-center ${
          clicked || isMapFocused ? "" : "items-center"
        } rounded-md`}
      >
        {isMapFocused && !clicked && (
          <motion.div
            style={{ backgroundColor: data.colour }}
            animate={{
              width: METROSTOP_CIRCLE_SIZE,
              height: METROSTOP_CIRCLE_SIZE,
              y: height,
            }}
            className="absolute rounded-xl text-xs flex justify-center items-center"
          >
            {data.articles.length}
          </motion.div>
        )}

        {/* node words label */}
        {shouldRenderContent && (
          <motion.div
            variants={nodeWordsVariantsFactory(
              isMapFocused,
              height,
              screenHeight,
              CLICKED_ARTICLE_CONTAINER_HEIGHT
            )}
            style={{ backgroundColor: data.colour }}
            className={`truncate text-sm text-black ${
              isMapFocused
                ? `absolute rounded-md px-2 ${clicked ? "text-4xl" : "text-sm"}`
                : ""
            }`}
            animate={clicked ? "clicked" : "default"}
            onClick={onClick}
          >
            {content}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
