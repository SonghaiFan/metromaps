import React from "react";
import { motion } from "framer-motion";
import ArticleStack from "./ArticleStack";
import { nodeWordsVariantsFactory } from "../utilities/metroStopUtilities";
import { useWindowSize } from "react-use";
import { ARTICALSTACK_INNER_PADDING } from "../utilities/util";
import NeighbouringNodes from "./NeighbouringNodes";
import { METROSTOP_CIRCLE_SIZE } from "../utilities/util";

const EXCLUDED_TITLES = ["herald sun", "opinion"];

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
  onNeighbourNodeLabelClick,
  onNodeNumberLabelClick,
  onNodeWordsLabelClick,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  const content = data.node_words.length > 0 ? data.node_words[0] : "";

  const ARTICLE_SIZE_MULTIPLIER = 1.25;
  const ARTICLE_HEIGHT = (screenHeight / 18) * ARTICLE_SIZE_MULTIPLIER;
  const ARTICLE_WIDTH = (screenWidth / 13) * ARTICLE_SIZE_MULTIPLIER;
  const ZOOMED_IN_ARTICLE_HEIGHT =
    (3 * ARTICLE_HEIGHT) / ARTICLE_SIZE_MULTIPLIER;
  const ZOOMED_IN_ARTICLE_WIDTH = (8 * ARTICLE_WIDTH) / ARTICLE_SIZE_MULTIPLIER;
  const ARTICLE_LIMIT = 4;
  const CLICKED_ARTICLE_CONTAINER_HEIGHT =
    ZOOMED_IN_ARTICLE_HEIGHT * ARTICLE_LIMIT +
    ARTICALSTACK_INNER_PADDING * (ARTICLE_LIMIT - 1);

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
          onNeighbourNodeLabelClick={onNeighbourNodeLabelClick}
        />
      )}
      {isMapFocused && (
        <>
          <ArticleStack
            data={data}
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
              className={"absolute text-sm m-1 line-clamp-2 font-bold"}
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
              ? "rgba(0, 0, 0, 0.9)"
              : "rgba(0, 0, 0, 0)"
            : data.colour, //"white"
        }}
        className={`w-fll ml-5 mt-5 h-full text-black truncate flex justify-center -z-40 ${
          clicked || isMapFocused ? "" : "items-center"
        } rounded-md`}
      >
        {/* node number label */}
        {isMapFocused && !clicked && (
          <motion.div
            data-type="node-number-label"
            id={data.id}
            style={{
              backgroundColor: data.colour, //"white"
              border: "2px solid white",
            }}
            animate={{
              width: METROSTOP_CIRCLE_SIZE,
              height: METROSTOP_CIRCLE_SIZE,
              y: height - METROSTOP_CIRCLE_SIZE,
              x: -METROSTOP_CIRCLE_SIZE / 2,
            }}
            className={`node-${data.id} untouched absolute rounded-xl text-xs flex justify-center items-center hover:border-2 cursor-pointer`}
            onClick={(event) => onNodeNumberLabelClick(event.target)}
          >
            {data.articles.length}
          </motion.div>
        )}

        {/* node words label */}
        {shouldRenderContent && (
          <motion.div
            data-type="node-words-label"
            id={data.id}
            variants={nodeWordsVariantsFactory(
              isMapFocused,
              height - METROSTOP_CIRCLE_SIZE,
              screenHeight,
              CLICKED_ARTICLE_CONTAINER_HEIGHT
            )}
            style={{
              backgroundColor:
                // "white",
                data.colour,
              border: "2px solid white",
            }}
            className={`node-${
              data.id
            } untouched truncate text-black cursor-pointer  ${
              isMapFocused
                ? `absolute rounded-md px-2 ${clicked ? "text-4xl" : "text-sm"}`
                : ""
            }`}
            animate={clicked ? "clicked" : "default"}
            onClick={(event) =>
              isMapFocused ? onNodeWordsLabelClick(event.target) : undefined
            }
          >
            {content}
          </motion.div>
        )}
      </motion.div>
    </>
  );
}
