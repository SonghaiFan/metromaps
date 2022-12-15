import React, { useState, useMemo, useEffect, useRef } from "react";
import { calculateMetroMapLayout } from "../utilities/calculateMetroMapLayout";
import MetroStop from "./MetroStop";
import { margin } from "../utilities/util";
import { motion } from "framer-motion";
import { metroStopVariantsFactory } from "../utilities/metroMapUtilities";
import NavigationButton from "./NavigationButton";
import { ReactComponent as BackArrow } from "../assets/BackArrow.svg";
import MetroMapDescription from "./MetroMapDescription";
import MetroLine from "./MetroLine";
import MetroLineLabel from "./MetroLineLabel";
import TimeAxis from "./TimeAxis";
import { MdMenu } from "react-icons/md";
import { METROSTOP_BOTTOM_PADDING } from "../utilities/metroMapUtilities";
import { MAX_ARTICLES } from "../utilities/calculateMetroMapLayout";
import { TIME_AXIS_PADDING } from "./TimeAxis";
import { SideDrawer } from "./SideDrawer";

const TOP_FULL_PAGE_PADDING = 20;

export default function MetroMap({
  width,
  height,
  data,
  title,
  onFocusButtonClick,
  isMapFocused,
  screenWidth,
  screenHeight,
  description,
  updateArticleAnimationDelayRef,
  clearArticleAnimationDelayRef,
  metroLineShown,
  updateMetroMapLineShown,
  hint,
  subtitle,
  zoomOutButtonClicked,
}) {
  const [filteredData, setFilteredData] = useState(data);

  const topics = useMemo(
    () =>
      data.nodes.reduce((accumulator, node) => {
        const topicNumber = node.id.split("_")[1];
        return accumulator.includes(topicNumber)
          ? accumulator
          : accumulator.concat(topicNumber);
      }, []),
    [data]
  );

  const [linesShown, setLinesShown] = useState(metroLineShown || topics.length);

  const handleLineFiltering = (number) => {
    setFilteredData(() => {
      const filteredTopics = topics.slice(0, number);
      const filteredNodes = data.nodes.filter((node) => {
        const topicNumber = node.id.split("_")[1];
        return filteredTopics.includes(topicNumber);
      });
      const filteredLines = data.lines.filter((line) => {
        const topicNumbers = line.links.reduce(
          (accumulator, { source, target }) =>
            accumulator.concat(source.split("_")[1], target.split("_")[1]),
          []
        );
        return topicNumbers.reduce(
          (accumulator, topicNumber) =>
            accumulator &&
            filteredTopics.find((topic) => topic === topicNumber),
          true
        );
      });

      const filteredLinks = data.links.filter(({ source, target }) => {
        // after the first filtering, the data format changes
        // (previously source was an object, the next iteration, source only contains the node id)
        return (
          filteredTopics.includes(
            (source.id ? source.id : source).split("_")[1]
          ) &&
          filteredTopics.includes(
            (target.id ? target.id : target).split("_")[1]
          )
        );
      });

      return {
        ...data,
        nodes: filteredNodes,
        lines: filteredLines,
        links: filteredLinks,
      };
    });
  };

  useEffect(() => {
    if (metroLineShown) {
      handleLineFiltering(metroLineShown);
    }
    // disabled warning since we know we only need to run the code once
    // lineShown will be handled locally by each metromap
    // metroLineShown is only needed when the component is unmounted and mounted again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);

  const openSideDrawer = (event) => {
    console.log(event.target.style.backgroundColor);
    event.target.style.backgroundColor = "red";
    setSideDrawerOpen(true);
  };

  const closeSideDrawer = () => {
    setSideDrawerOpen(false);
  };

  const NODE_HEIGHT = (screenHeight / 18) * 1.25;
  const NODE_WIDTH = (screenWidth / 13) * 1.25;
  const LANDING_HEIGHT = screenHeight / 28;
  const LANDING_WIDTH = screenWidth / 23;

  const landingPageYPadding = margin.y * height;
  const landingPageXPadding = 0;
  const [landingNodes, landingLines] = useMemo(
    () => calculateMetroMapLayout(width, height, filteredData, margin),
    [width, height, filteredData]
  );

  const fullPageYPadding = margin.y * screenHeight + TOP_FULL_PAGE_PADDING;
  const fullPageXPadding = margin.x * screenWidth;
  const [nodes, lines, columns] = useMemo(
    () =>
      calculateMetroMapLayout(screenWidth, screenHeight, filteredData, margin),
    [screenWidth, screenHeight, filteredData]
  );

  const paddingX = isMapFocused
    ? fullPageXPadding - NODE_WIDTH / 2
    : landingPageXPadding;
  const paddingY = isMapFocused
    ? fullPageYPadding - NODE_HEIGHT
    : landingPageYPadding;

  const generatePaths = (line) => {
    const pathCoordinates = line.pathCoords;

    const endPointToEndPointCoordinates = [];
    for (let i = 0; i < pathCoordinates.length - 1; i++) {
      if (pathCoordinates[i].endPoint) {
        // add starting end point
        const coordinates = [pathCoordinates[i]];
        // add anything in between the two end points
        let j = i + 1;
        while (!pathCoordinates[j].endPoint) {
          coordinates.push(pathCoordinates[j]);
          j++;
        }
        // add ending end point
        coordinates.push(pathCoordinates[j]);
        endPointToEndPointCoordinates.push(coordinates);
      }
    }

    const labels = endPointToEndPointCoordinates.map((coordinates) => {
      const endingEndPoint = coordinates[coordinates.length - 1];
      return {
        label: endingEndPoint.edgeLabel || null,
        colour: endingEndPoint.edgeLabel
          ? endingEndPoint.edgeColour || line.colour
          : null,
        points: [coordinates[1], coordinates[coordinates.length - 2]],
      };
    });

    const paths = endPointToEndPointCoordinates.map((coordinates) => {
      const endingEndPoint = coordinates[coordinates.length - 1];
      return {
        path: coordinates,
        colour: endingEndPoint.edgeColour || line.colour,
      };
    });

    return [paths, labels];
  };

  const metroLineData = useMemo(
    () =>
      Object.keys(lines).map((lineId) => {
        const activeLines = isMapFocused ? lines : landingLines;

        const [paths, labels] = generatePaths(activeLines[lineId]);

        return { [lineId]: { paths, labels } };
      }),
    [lines, landingLines, isMapFocused]
  );

  const titleRef = useRef();
  const [titleAnimation, setTitleAnimation] = useState({});
  useEffect(() => {
    const titleElement = titleRef.current;
    if (titleElement.offsetWidth < titleElement.scrollWidth) {
      setTitleAnimation({
        x: [0, -5 * title.length],
        transition: {
          x: {
            repeat: Infinity,
            repeatType: "loop",
            duration: 5,
            ease: "linear",
          },
        },
      });
      return;
    } else {
      setTitleAnimation({});
    }
    // disabled warning since we know title will never change after being set once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screenWidth, screenHeight]);

  const [clickedNode, setClickedNode] = useState(null);
  const [clickedNodeBuffer, setClickedNodeBuffer] = useState(null);
  const [previousClickedNode, setPreviousClickedNode] = useState(null);
  const [foundLinkData, setFoundLinkData] = useState(null);

  // needed for transition animation - find out which nodes and link to draw
  useEffect(() => {
    if (previousClickedNode && clickedNodeBuffer) {
      const foundLineId = Object.keys(lines).find((lineId) => {
        return (
          lines[lineId].links.filter(
            (link) =>
              (link.source === previousClickedNode &&
                link.target === clickedNodeBuffer) ||
              (link.source === clickedNodeBuffer &&
                link.target === previousClickedNode)
          ).length > 0
        );
      });

      const { paths } = metroLineData.find(
        (line) => Object.keys(line)[0] === foundLineId
      )[foundLineId];

      const foundLinkData = paths.filter(
        ({ path }) =>
          path[path.length - 1].source === previousClickedNode &&
          path[path.length - 1].target === clickedNodeBuffer
      );

      const foundLinkDataReversed = paths.filter(
        ({ path }) =>
          path[path.length - 1].source === clickedNodeBuffer &&
          path[path.length - 1].target === previousClickedNode
      );

      setFoundLinkData({
        data:
          foundLinkDataReversed.length > 0
            ? foundLinkDataReversed
            : foundLinkData,
        reversed: foundLinkDataReversed.length > 0,
      });
    }
  }, [previousClickedNode, clickedNodeBuffer, metroLineData, lines]);

  useEffect(() => {
    if (zoomOutButtonClicked) {
      onZoomOutButtonClick();
      console.log("zoom out button clicked");
    }
    // onZoomOutButtonClick will never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [zoomOutButtonClicked]);

  const onArticleStackAnimationComplete = () => {
    if (clickedNodeBuffer) {
      updateArticleAnimationDelayRef(
        setTimeout(() => {
          setClickedNode(clickedNodeBuffer);
          setClickedNodeBuffer(null);
        }, 2000)
      );
    }
  };

  const handleMetroStopClick = (nodeId) => () => {
    // if the user clicks on next/previous neighbouring node button
    if (clickedNode) {
      setClickedNodeBuffer(nodeId);
      setPreviousClickedNode(clickedNode);
      setClickedNode(null);
      return;
    }

    // if the user clicks the node directly (not the neighbouring node button)
    setClickedNode(nodeId);
    console.log("clicked node directly", nodeId);
  };

  const onZoomOutButtonClick = () => {
    clearArticleAnimationDelayRef();
    setClickedNodeBuffer(null);
    setClickedNode(null);
    setPreviousClickedNode(null);
  };

  return (
    <motion.div>
      <motion.div
        className="absolute w-full h-full cursor-pointer"
        onClick={onFocusButtonClick}
      >
        {/* landing page lines */}
        {!isMapFocused && (
          <motion.svg
            className="absolute"
            x="0"
            y="0"
            width={isMapFocused ? screenWidth : width}
            height={isMapFocused ? screenHeight : height}
          >
            {metroLineData.map((data) => {
              const [lineId, { paths }] = Object.entries(data)[0];

              return (
                <motion.g
                  animate={{
                    x:
                      paddingX +
                      (isMapFocused ? NODE_WIDTH / 2 : LANDING_WIDTH / 2),
                    y:
                      paddingY +
                      (isMapFocused ? NODE_HEIGHT : LANDING_HEIGHT / 2),
                  }}
                  key={lineId}
                >
                  <MetroLine strokeWidth={7.5} data={paths} />
                </motion.g>
              );
            })}
          </motion.svg>
        )}

        {isMapFocused && (
          <motion.div
            style={{ width: screenWidth, height: screenHeight }}
            className="absolute"
          >
            <TimeAxis
              data={columns}
              nodeWidth={NODE_WIDTH}
              nodeHeight={NODE_HEIGHT}
              paddingX={paddingX}
              paddingY={paddingY}
            />
          </motion.div>
        )}

        {/* full page lines */}
        {isMapFocused && (
          <>
            <motion.svg
              className="absolute"
              x="0"
              y="0"
              width={isMapFocused ? screenWidth : width}
              height={isMapFocused ? screenHeight : height}
            >
              {metroLineData.map((data) => {
                const [lineId, { paths }] = Object.entries(data)[0];

                return (
                  <motion.g
                    animate={{
                      x:
                        paddingX +
                        (isMapFocused ? NODE_WIDTH / 2 : LANDING_WIDTH / 2),
                      y:
                        paddingY +
                        (isMapFocused ? NODE_HEIGHT : LANDING_HEIGHT / 2),
                    }}
                    key={lineId}
                  >
                    <MetroLine data={paths} />
                  </motion.g>
                );
              })}
            </motion.svg>

            {/* link labels */}
            <motion.div className="absolute">
              {metroLineData.map((data) => {
                // console.log("data", data);
                // console.log("Object.entries(data)", Object.entries(data));
                // console.log("Object.entries(data)[0]", Object.entries(data)[0]);
                const [lineId, { labels }] = Object.entries(data)[0];

                return (
                  <motion.div
                    animate={{
                      x: paddingX + NODE_WIDTH / 2,
                      y: paddingY + NODE_HEIGHT,
                    }}
                    key={lineId}
                  >
                    {labels.map((label, index) => {
                      return (
                        <MetroLineLabel
                          key={`${lineId}-${index}`}
                          data={label}
                          onMetroLineLabelClick={(event) =>
                            openSideDrawer(event)
                          }
                        />
                      );
                    })}
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}

        <motion.div>
          {Object.keys(nodes).map((nodeId) => {
            const { x: landingX, y: landingY } = landingNodes[nodeId];

            const articles = nodes[nodeId].articles.map((articleId) => {
              return filteredData.articles[articleId];
            });

            return (
              <motion.div
                className="absolute"
                variants={metroStopVariantsFactory(
                  screenWidth,
                  screenHeight,
                  isMapFocused,
                  nodes[nodeId],
                  landingX,
                  landingY,
                  LANDING_WIDTH,
                  LANDING_HEIGHT,
                  paddingX,
                  paddingY,
                  NODE_WIDTH,
                  NODE_HEIGHT
                )}
                animate={clickedNode === nodeId ? "clicked" : "default"}
                key={nodeId}
                id={nodeId}
              >
                <MetroStop
                  data={nodes[nodeId]}
                  articles={articles}
                  isMapFocused={isMapFocused}
                  shouldRenderContent={true}
                  width={NODE_WIDTH}
                  height={NODE_HEIGHT}
                  onClick={
                    isMapFocused ? handleMetroStopClick(nodeId) : () => {}
                  }
                  clicked={clickedNode === nodeId}
                  onNeighbouringNodeClick={(neighbourId) => {
                    return handleMetroStopClick(neighbourId);
                  }}
                  onArticleStackAnimationComplete={
                    onArticleStackAnimationComplete
                  }
                  onArticleStackLabelClick={openSideDrawer}
                  onNeighbourNodeLabelClick={openSideDrawer}
                />
              </motion.div>
            );
          })}

          {/* transition animation */}
          {previousClickedNode && clickedNodeBuffer && (
            <motion.div>
              <motion.div
                className="absolute top-0 left-0 w-screen h-screen"
                style={{ backgroundColor: "rgba(0, 0, 0, 0.8)" }}
              />
              {foundLinkData && (
                <motion.svg
                  className="absolute"
                  x="0"
                  y="0"
                  width={screenWidth}
                  height={screenHeight}
                >
                  <motion.g
                    animate={{
                      x:
                        paddingX +
                        (isMapFocused ? NODE_WIDTH / 2 : LANDING_WIDTH / 2),
                      y:
                        paddingY +
                        (isMapFocused ? NODE_HEIGHT : LANDING_HEIGHT / 2),
                    }}
                  >
                    <MetroLine
                      data={foundLinkData.data}
                      reversed={foundLinkData.reversed}
                    />
                  </motion.g>
                </motion.svg>
              )}
              {[previousClickedNode, clickedNodeBuffer].map((nodeId) => {
                const { x: landingX, y: landingY } = landingNodes[nodeId];

                const articles = nodes[nodeId].articles.map((articleId) => {
                  return filteredData.articles[articleId];
                });

                return (
                  <motion.div
                    className="absolute"
                    variants={metroStopVariantsFactory(
                      screenWidth,
                      screenHeight,
                      isMapFocused,
                      nodes[nodeId],
                      landingX,
                      landingY,
                      LANDING_WIDTH,
                      LANDING_HEIGHT,
                      paddingX,
                      paddingY,
                      NODE_WIDTH,
                      NODE_HEIGHT
                    )}
                    animate={clickedNode === nodeId ? "clicked" : "default"}
                    key={nodeId}
                  >
                    <MetroStop
                      data={nodes[nodeId]}
                      articles={articles}
                      isMapFocused={isMapFocused}
                      shouldRenderContent={true}
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      onClick={
                        isMapFocused ? handleMetroStopClick(nodeId) : () => {}
                      }
                      clicked={clickedNode === nodeId}
                      onNeighbouringNodeClick={(neighbourId) => {
                        return handleMetroStopClick(neighbourId);
                      }}
                      onArticleStackAnimationComplete={() => {}}
                      // do not pass in onArticleStackAnimationComplete.
                      // otherwise, it will assign 2 additional setTimeout
                      // (executed after the animation for the source and target node is completed)
                    />
                  </motion.div>
                );
              })}
            </motion.div>
          )}

          {/* metromap title */}
          <motion.div
            className={`w-full absolute ${
              isMapFocused
                ? "text-2xl"
                : `flex flex-col justify-start pt-14 content-center `
            }`}
            animate={{
              x: isMapFocused ? 0 : margin.x * width,
              y: isMapFocused ? 0 : height - height * margin.y - 10,
              width: isMapFocused
                ? (2 * screenWidth) / 3
                : width - margin.x * width,
            }}
          >
            <motion.div
              style={{ width: isMapFocused ? width * 3 : width - 64 }}
              className="px-8 py-1 m-0 whitespace-nowrap overflow-x-auto scrollbar-none text-xl"
            >
              <motion.h2
                animate={isMapFocused ? {} : titleAnimation}
                ref={titleRef}
              >
                {title}
              </motion.h2>
            </motion.div>
            <MetroMapDescription
              isDisplayed={!isMapFocused}
              description={description}
              subtitle={subtitle}
              hint={hint}
              height={screenHeight / 3}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      <NavigationButton
        onClick={onZoomOutButtonClick}
        // z-10 so that this will be shown on top of the NavigationButton of Menu.js when an article is on focus (see Menu.js)
        className={`left-0 top-[90%] z-50`}
        isVisible={clickedNode !== null || clickedNodeBuffer !== null}
      >
        <BackArrow className="bg-transparent w-20" />
      </NavigationButton>
      {isMapFocused && (
        <>
          <motion.button
            className="absolute right-0 flex justify-center items-center text-4xl"
            animate={{
              width: margin.x * screenWidth,
              height:
                paddingY -
                METROSTOP_BOTTOM_PADDING -
                MAX_ARTICLES -
                TIME_AXIS_PADDING,
            }}
            onClick={openSideDrawer}
          >
            <MdMenu />
          </motion.button>
          <SideDrawer
            isVisible={sideDrawerOpen}
            close={closeSideDrawer}
            screenWidth={screenWidth}
            screenHeight={screenHeight}
            paddingY={paddingY}
          >
            {/* <motion.div className="text-2xl">
              Show{" "}
              <motion.select
                value={linesShown}
                className="text-black "
                onChange={(event) => {
                  setLinesShown(event.target.value);
                  updateMetroMapLineShown(event.target.value);
                  handleLineFiltering(event.target.value);
                }}
              >
                {Array(topics.length - 1)
                  .fill()
                  .map((_, i) => {
                    return (
                      <motion.option key={i} value={i + 2}>
                        {i === topics.length - 2 ? "All" : `${i + 2}`}
                      </motion.option>
                    );
                  })}
              </motion.select>{" "}
              lines
            </motion.div> */}
            <motion.div className="text-2xl">
              {/* range slider with five step, label is very high, high, moderate, weak, very weak */}
              <motion.div className="text-2xl">
                Please rate the degree of relevance
              </motion.div>

              <input
                type="range"
                class="w-full h-3 bg-gray-70 rounded-lg appearance-none cursor-pointer range-lg bg-gradient-to-r from-[#585d91] via-[#48a49e] to-[#fce554]"
                min="1"
                max="5"
                step="1"
                list="tickmarks"
                onChange={(event) => {
                  console.log(event.target.value);
                  // setLinesShown(event.target.value);
                  // updateMetroMapLineShown(event.target.value);
                  // handleLineFiltering(event.target.value);
                }}
              />
              <datalist id="tickmarks" class="felex flex-col ">
                <option value="1">Very high</option>
                <option value="2">High</option>
                <option value="3">Moderate</option>
                <option value="4">Weak</option>
                <option value="5">Very weak</option>
              </datalist>
              <div class="w-full flex justify-between text-xs px-2">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <div class="w-full flex justify-between text-xs px-2">
                <span>Very weak</span>
                <span>Weak</span>
                <span>Moderate</span>
                <span>High</span>
                <span>Very high</span>
              </div>
            </motion.div>
          </SideDrawer>
        </>
      )}
    </motion.div>
  );
}
