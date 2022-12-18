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

import { interpolateRgb } from "d3-interpolate";

const cutomerInterpolation = interpolateRgb("#48a49e", "#fce554");

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
  // console.log(data);
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

  const [whoOpenSideDrawer, setWhoOpenSideDrawer] = useState();

  const openSideDrawer = (who) => {
    // console.log("whoOpenSideDrawer", whoOpenSideDrawer);
    // console.log("who", who);
    setWhoOpenSideDrawer(who);
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

  const [customNodes, setCustomeNodes] = useState(nodes);

  const handleCustomNodes = (nodeId, newColour) => {
    console.log("nodeId", nodeId);
    console.log("newColour", newColour);
    console.log("nodes", nodes);

    setCustomeNodes(() => {
      const updatedNodes = Object.assign({}, nodes);
      updatedNodes[nodeId] && (updatedNodes[nodeId].colour = newColour);

      for (let eachNode in updatedNodes) {
        const conNodes = updatedNodes[eachNode].connectedNodes;
        console.log(conNodes);

        conNodes.forEach((node) => {
          node.id === nodeId && (node.colour = newColour);
        });
      }
      return updatedNodes;
    });
  };

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
        id: endingEndPoint.source + "-" + endingEndPoint.target,
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
        id: endingEndPoint.source + "-" + endingEndPoint.target,
        path: coordinates,
        colour: endingEndPoint.edgeColour || line.colour,
      };
    });

    return [paths, labels];
  };

  const [customLines, setCustomLines] = useState(lines);
  const [customLandingLines, setCustomLandingLines] = useState(landingLines);

  const metroLineData = useMemo(
    () =>
      Object.keys(customLines).map((lineId) => {
        const activeLines = isMapFocused ? customLines : customLandingLines;

        const [paths, labels] = generatePaths(activeLines[lineId]);

        const lineData = { [lineId]: { paths, labels } };

        return lineData;
      }),
    [customLines, customLandingLines, isMapFocused]
  );

  const customMetroLineData = metroLineData;

  const addCutomLineColor = (data, pathId, newColour) => {
    const updatedData = Object.assign({}, data);

    const [pathStartId, pathEndId] = pathId.split("-");

    console.log(pathStartId);

    for (let lineId in updatedData) {
      const linePathCoords = updatedData[lineId].pathCoords;

      linePathCoords.forEach((coords) => {
        coords.source === pathStartId &&
          coords.target === pathEndId &&
          (coords.edgeColour = newColour);
      });
    }
    return updatedData;
  };

  const handleCustomLines = (pathId, newColour) => {
    setCustomLines(addCutomLineColor(lines, pathId, newColour));

    setCustomLandingLines(addCutomLineColor(landingLines, pathId, newColour));
  };

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

      const { paths } = customMetroLineData.find(
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
  }, [previousClickedNode, clickedNodeBuffer, customMetroLineData, lines]);

  // console.log(metroLineData);

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
            {customMetroLineData.map((data) => {
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
              {customMetroLineData.map((data) => {
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
              {customMetroLineData.map((data) => {
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
                          onMetroLineLabelClick={(event) => {
                            console.log(
                              `metro line: ${lineId}-${index} label: ${label.label} clicked`
                            );
                            openSideDrawer(event.target);
                          }}
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
          {Object.keys(customNodes).map((nodeId) => {
            const { x: landingX, y: landingY } = landingNodes[nodeId];

            const articles = customNodes[nodeId].articles.map((articleId) => {
              return filteredData.articles[articleId];
            });

            return (
              <motion.div
                className="absolute"
                variants={metroStopVariantsFactory(
                  screenWidth,
                  screenHeight,
                  isMapFocused,
                  customNodes[nodeId],
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
                  data={customNodes[nodeId]}
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

                const articles = customNodes[nodeId].articles.map(
                  (articleId) => {
                    return filteredData.articles[articleId];
                  }
                );
                console.log("articles", articles);

                return (
                  <motion.div
                    className="absolute"
                    variants={metroStopVariantsFactory(
                      screenWidth,
                      screenHeight,
                      isMapFocused,
                      customNodes[nodeId],
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
                      data={customNodes[nodeId]}
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
        <SideDrawer
          isVisible={sideDrawerOpen}
          close={closeSideDrawer}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          paddingY={paddingY}
        >
          <motion.div className="text-2xl">
            {/* range slider with five step, label is very high, high, moderate, weak, very weak */}
            <motion.div className="text-2xl">
              Please rate the degree of relevance
            </motion.div>
            <motion.input
              type="range"
              className="w-full h-3 bg-gray-70 rounded-lg appearance-none cursor-pointer range-lg bg-gradient-to-r from-[#585d91] via-[#48a49e] to-[#fce554]"
              min="0"
              max="1"
              step="0.25"
              list="tickmarks"
              onChange={(event) => {
                console.log("in the drawer: ", whoOpenSideDrawer);

                const newColour = cutomerInterpolation(event.target.value);

                const type = whoOpenSideDrawer.dataset.type;
                console.log("type", type);
                const whoId = whoOpenSideDrawer.id;
                console.log("whoId", whoId);

                if (type === "metro-line-label") {
                  console.log(`this is a metro line label at ${whoId}`);
                  handleCustomLines(whoId, newColour);
                }

                if (
                  type === "node-words-label" ||
                  type === "neighbour-node-label"
                ) {
                  console.log(`this is a node word label at ${whoId}`);
                  handleCustomNodes(whoId, newColour);
                }

                // setLinesShown(event.target.value);
                // updateMetroMapLineShown(event.target.value);
                // handleLineFiltering(event.target.value);
              }}
            />
            <motion.datalist id="tickmarks" className="felex flex-col ">
              <option>Very high</option>
              <option>High</option>
              <option>Moderate</option>
              <option>Weak</option>
              <option>Very weak</option>
            </motion.datalist>
            <motion.div className="w-full flex justify-between text-xs px-2">
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
              <span>|</span>
            </motion.div>
            <motion.div className="w-full flex justify-between text-xs px-2">
              <span>Very weak</span>
              <span>Weak</span>
              <span>Moderate</span>
              <span>High</span>
              <span>Very high</span>
            </motion.div>
          </motion.div>
        </SideDrawer>
      )}
    </motion.div>
  );
}
