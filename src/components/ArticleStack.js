import React, {useState} from "react";
import { motion } from "framer-motion";
import Article from "./Article";
import { articleVariantsFactory } from "../utilities/articleStackUtilities";
import { useWindowSize } from "react-use";
import { TOP_PADDING, INNER_PADDING } from "../utilities/articleStackUtilities";
import mixpanel from 'mixpanel-browser';

function getTimestampInSeconds () {
  return Math.floor(Date.now() / 1000)
}

export default function ArticleStack({
  data,
  articles,
  colour,
  onClick,
  clicked,
  clickedArticleContainerHeight,
  zoomedInArticleWidth,
  zoomedInArticleHeight,
  articleWidth,
  articleHeight,
  articleLimit,
  onAnimationComplete,
}) {
  const { width: screenWidth, height: screenHeight } = useWindowSize();
  // console.log(data);
  let [lastObservedTime, setLastObservedTime] = useState(null)
  return (
    <motion.div
      onScroll={()=> {
        let currentTime = getTimestampInSeconds()
        if (lastObservedTime === null) {
          setLastObservedTime(currentTime)
          console.log("I am being scrolled")
          mixpanel.track("Article Scroll")
        } else if (currentTime - lastObservedTime > 1) {
          console.log("I am being scrolled")
          setLastObservedTime(currentTime)
          mixpanel.track("Article Scroll")
        } else {

        }
      }}
      className={`${
        clicked
          ? `absolute top-0 left-0 w-full h-full overflow-y-scroll cursor-zoom-in${
              articles.length > articleLimit ? "scrollbar" : "scrollbar-none"
            }`
          : ""
      }`}
      style={{
        maxHeight: clicked ? clickedArticleContainerHeight : "100%",
      }}
      animate={{
        x: clicked ? screenWidth / 2 - zoomedInArticleWidth / 2 : 0,
        y: clicked ? TOP_PADDING : 0,
        width: zoomedInArticleWidth + INNER_PADDING * 2,
      }}
    >
      {
        // reversing an array of objects: https://stackoverflow.com/questions/51479338/reverse-array-of-objects-gives-same-output-2
        []
          .concat(articles)
          .reverse()
          .map((article, articleIndex, array) => {
            return (
              <motion.div
                key={article.id}
                className={`article-${data.id} absolute rounded-md`}
                style={{
                  // border: "1px solid white",
                  backgroundColor: clicked
                    ? "white"
                    : (array.length - articleIndex) % 2 === 0
                    ? "grey"
                    : colour,
                }}
                variants={articleVariantsFactory(
                  array.length,
                  articleIndex,
                  screenWidth,
                  screenHeight,
                  articleWidth,
                  articleHeight,
                  zoomedInArticleWidth,
                  zoomedInArticleHeight
                )}
                animate={clicked ? "clicked" : "default"}
                onAnimationComplete={() => {
                  if (articleIndex === array.length - 1) {
                    onAnimationComplete();
                  }
                }}
              >
                <Article article={article} metroStopClicked={clicked} />

                {/* helper onClick layer */}
                {!clicked && (
                  <motion.div
                    className="absolute w-full h-full"
                    onClick={onClick}
                  />
                )}
              </motion.div>
            );
          })
      }
    </motion.div>
  );
}
