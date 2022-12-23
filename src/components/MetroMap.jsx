import React, { useState, useMemo, useEffect, useRef } from "react";
import { calculateMetroMapLayout } from "../utilities/calculateMetroMapLayout";
import MetroStop from "./MetroStop";
import { margin } from "../utilities/util";
import { motion } from "framer-motion";
import { metroStopVariantsFactory } from "../utilities/metroMapUtilities";
import NavigationButton from "./NavigationButton";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import MetroMapDescription from "./MetroMapDescription";
import MetroLine from "./MetroLine";
import MetroLineLabel from "./MetroLineLabel";
import TimeAxis from "./TimeAxis";
import { SideDrawer } from "./SideDrawer";
import mixpanel from "mixpanel-browser";

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
  hint,
  subtitle,
  zoomOutButtonClicked,
}) {
  // console.log(data);

  const [filteredData, setFilteredData] = useState(data);

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

  const fullPageYPadding = margin.y * screenHeight + TOP_FULL_PAGE_PADDING;
  const fullPageXPadding = margin.x * screenWidth;

  const [nodes, lines, columns] = useMemo(
    () =>
      calculateMetroMapLayout(screenWidth, screenHeight, filteredData, margin),
    [screenWidth, screenHeight, filteredData]
  );

  const [customNodes, setCustomeNodes] = useState(nodes);

  const handleCustomNodes = (nodeId, newColour) => {
    setCustomeNodes(() => {
      nodes[nodeId] && (nodes[nodeId].colour = newColour);

      for (let eachNode in nodes) {
        const conNodes = nodes[eachNode].connectedNodes;
        // console.log(conNodes);

        conNodes.forEach((node) => {
          node.id === nodeId && (node.colour = newColour);
        });
      }
      return nodes;
    });
  };

  const paddingX = fullPageXPadding - NODE_WIDTH / 2;
  const paddingY = fullPageYPadding - NODE_HEIGHT;

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

  const metroLineData = useMemo(
    () =>
      Object.keys(customLines).map((lineId) => {
        const [paths, labels] = generatePaths(customLines[lineId]);

        const lineData = { [lineId]: { paths, labels } };

        return lineData;
      }),
    [customLines]
  );

  const addCutomLineColor = (data, pathId, newColour) => {
    // const updatedData = Object.assign({}, data);

    const [pathStartId, pathEndId] = pathId.split("-");

    // console.log(pathStartId);

    for (let lineId in data) {
      const linePathCoords = data[lineId].pathCoords;

      linePathCoords.forEach((coords) => {
        coords.source === pathStartId &&
          coords.target === pathEndId &&
          (coords.edgeColour = newColour);
      });
    }
    return data;
  };

  const handleCustomLines = (pathId, newColour) => {
    setCustomLines(addCutomLineColor(lines, pathId, newColour));
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

  // console.log(metroLineData);

  useEffect(() => {
    if (zoomOutButtonClicked) {
      onZoomOutButtonClick();
      // console.log("zoom out button clicked")
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
    mixpanel.track("MetroStopClick on neighbouring node button", {
      nodeId: nodeId,
    });
    // if the user clicks on next/previous neighbouring node button
    if (clickedNode) {
      setClickedNodeBuffer(nodeId);
      setPreviousClickedNode(clickedNode);
      setClickedNode(null);
      return;
    }

    // if the user clicks the node directly (not the neighbouring node button)
    setClickedNode(nodeId);
    mixpanel.track("MetroStopClick on node button directly", {
      nodeId: nodeId,
    });
  };

  const onZoomOutButtonClick = () => {
    mixpanel.track("MetroStop ZoomOut button clicked");
    clearArticleAnimationDelayRef();
    setClickedNodeBuffer(null);
    setClickedNode(null);
    setPreviousClickedNode(null);
  };

  return (
    <motion.div>
      <motion.div
        className={`absolute w-full h-full ${
          isMapFocused ? "cursor-default" : "cursor-zoom-in"
        }`}
        onClick={onFocusButtonClick}
      >
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
                    <MetroLine
                      data={paths}
                      onClickToOpenDrawer={(event) => {
                        openSideDrawer(event.target);
                      }}
                    />
                  </motion.g>
                );
              })}
            </motion.svg>

            {/* link labels */}
            <motion.div className="absolute">
              {metroLineData.map((data) => {
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
            const { x: landingX, y: landingY } = nodes[nodeId];

            const articles = customNodes[nodeId].articles.map((articleId) => {
              return filteredData.articles[articleId];
            });

            return (
              <motion.div
                className={`metro-stop-wrapper absolute ${
                  clickedNode === nodeId ? "cursor-default" : "cursor-zoom-in"
                }`}
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
                  onNeighbourNodeLabelClick={openSideDrawer}
                  onNodeNumberLabelClick={openSideDrawer}
                  onNodeWordsLabelClick={openSideDrawer}
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
                const { x: landingX, y: landingY } = nodes[nodeId];

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
                {/* {title} */}
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
        className={`right-[1%] top-[3%] z-50`}
        isVisible={clickedNode !== null || clickedNodeBuffer !== null}
      >
        <AiOutlineFullscreenExit size={40} />
      </NavigationButton>

      {isMapFocused && (
        <SideDrawer
          isVisible={sideDrawerOpen}
          close={closeSideDrawer}
          screenWidth={screenWidth}
          screenHeight={screenHeight}
          paddingY={paddingY}
          whoOpenSideDrawer={whoOpenSideDrawer}
          handleCustomNodes={handleCustomNodes}
          handleCustomLines={handleCustomLines}
        ></SideDrawer>
      )}
    </motion.div>
  );
}
