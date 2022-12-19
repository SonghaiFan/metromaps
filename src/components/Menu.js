import React, { useReducer, useMemo, useState, useRef, useEffect } from "react";
import MetroMap from "./MetroMap";
import { loadData } from "../utilities/loadData";
import {
  ACTION_TYPES,
  FOCUS_MODE,
  metroMapContainerVariantsFactory,
  getAnimateState,
} from "../utilities/menuUtilities";
import { METROMAPS_LENGTH, METROMAPS_TIME } from "../utilities/metromaps";
import { AnimatePresence, motion } from "framer-motion";
import NavigationButton from "./NavigationButton";
import MetroMapLegend from "./MetroMapLegend";
import SelectorButton from "./SelectorButton";
import { AiOutlineFullscreenExit } from "react-icons/ai";
import { FaArrowAltCircleRight } from "react-icons/fa";
import { margin } from "../utilities/util";
import monashLogo from "../img/logo_monash_black.png";
import prfLogo from "../img/Logo-PRF.png";
import Timer from "./Timer";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const METROMAPS_PER_PAGE = 1; //Do not change this value
const HEADER_HEIGHT = 80;

const PAGE_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

const TOTAL_PAGES = Math.ceil(METROMAPS_LENGTH / METROMAPS_PER_PAGE);

export { PAGE_DIRECTION };

export default function Menu({
  metromaps,
  width: screenWidth,
  height: screenHeight,
  setStart,
}) {
  const metroMapWidth = (screenWidth / 2) * (1 - margin.x);
  const metroMapHeight = (screenHeight / 2) * (1 - margin.y);

  const flexMetroMapWidth = Math.min(
    (screenWidth / METROMAPS_PER_PAGE) * (1 - margin.x),
    metroMapWidth
  );
  const flexMetroMapHeight = screenHeight / 2;

  const legendWidth = screenWidth / 3;

  const metroMapsX = (screenWidth - flexMetroMapWidth * METROMAPS_PER_PAGE) / 2;
  const metroMapsY = (screenHeight - HEADER_HEIGHT * 2.5 - metroMapHeight) / 2;

  const fullViewLegendX = (screenWidth - legendWidth) / 2;
  const fullViewLegendY = 8;

  const noFullViewLegendX = (screenWidth - legendWidth) / 2;
  const noFullViewLegendY = metroMapsY - 15;

  const metromapsDetails = useMemo(() => {
    return metromaps.reduce((accumulatedDimensions, metromap, index) => {
      return {
        ...accumulatedDimensions,
        [metromap.url]: {
          width: flexMetroMapWidth,
          height: flexMetroMapHeight,
          xPosition:
            (index % METROMAPS_PER_PAGE) * flexMetroMapWidth + metroMapsX,
          yPosition: metroMapsY,
          /* copy data so that d3sankey does not mutate original data*/
          data: loadData(JSON.parse(JSON.stringify(metromap.data))),
          title: metromap.title,
          mapId: metromap.url,
        },
      };
    }, {});
  }, [
    metromaps,
    flexMetroMapWidth,
    flexMetroMapHeight,
    metroMapsX,
    metroMapsY,
  ]);

  const [pageState, setPageState] = useState({
    current: 1,
    hist: [1],
    total: TOTAL_PAGES,
    direction: PAGE_DIRECTION.RIGHT,
    time: METROMAPS_TIME[0],
  });

  const renderSelectors = () => {
    let numbersToRender = Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1);

    return (
      <div className="absolute bottom-10 w-screen ">
        <div className="flex w-[100%] justify-center items-center">
          <div className="m-[1%] flex">
            {numbersToRender.map((pageNumber) => {
              return (
                <SelectorButton
                  key={pageNumber}
                  isActive={pageNumber === pageState.current}
                  isDead={true}
                  isSmall={true}
                />
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  const initialFocusState = {
    map: null,
    mode: null,
  };

  const reducer = (previous, { type, payload: current }) => {
    switch (type) {
      case ACTION_TYPES.FULL_MAP_VIEW:
        return current;
      case ACTION_TYPES.LANDING_PAGE_VIEW:
        return { map: previous.map, mode: null };
      default:
        return previous;
    }
  };

  const [focusState, dispatch] = useReducer(reducer, initialFocusState);

  const onFocusButtonClick = (mapId) => () => {
    dispatch({
      type: ACTION_TYPES.FULL_MAP_VIEW,
      payload: { map: mapId, mode: FOCUS_MODE.FULL_VIEW },
    });
    // console.log("focusState", focusState);
  };

  const articleAnimationDelayRef = useRef();
  const [zoomOutButtonClicked, setZoomOutButtonClicked] = useState(false);

  useEffect(() => {
    if (focusState.mode === null) {
      setZoomOutButtonClicked(false);
    }
  }, [focusState.mode]);

  const updateArticleAnimationDelayRef = (timeoutId) => {
    // console.log("assigning");
    articleAnimationDelayRef.current = timeoutId;
  };

  const clearArticleAnimationDelayRef = () => {
    if (articleAnimationDelayRef.current) {
      // console.log("clearing");
      clearTimeout(articleAnimationDelayRef.current);
    }
  };

  const onZoomOutButtonClick = () => {
    setZoomOutButtonClicked(true);
    clearArticleAnimationDelayRef();
    dispatch({ type: ACTION_TYPES.LANDING_PAGE_VIEW });
  };

  // const [metroMapLineShown, setMetroMapLineShown] = useState({});

  // const updateMetroMapLineShown = (metroMapId) => (lineShown) => {
  //   setMetroMapLineShown((previousMetroMapLineShown) => {
  //     return {
  //       ...previousMetroMapLineShown,
  //       [metroMapId]: lineShown,
  //     };
  //   });
  // };

  const nextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, oldPageState.current + 1),
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: PAGE_DIRECTION.RIGHT,
      time: METROMAPS_TIME[
        Math.min(oldPageState.total - 1, oldPageState.current)
      ],
    };
  };

  const previousPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.max(1, oldPageState.current - 1),
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: PAGE_DIRECTION.LEFT,
      time: METROMAPS_TIME[Math.max(0, oldPageState.current - 2)],
    };
  };

  const renderMetroMap = (metromap) => {
    return (
      <motion.div
        className="absolute"
        variants={metroMapContainerVariantsFactory(
          metromapsDetails,
          metromap.url,
          screenHeight,
          screenWidth,
          pageState.direction
        )}
        initial="hidden"
        animate={getAnimateState(focusState, metromap)}
        key={metromap.url}
        exit="hidden"
      >
        <MetroMap
          {...metromapsDetails[metromap.url]}
          width={metromapsDetails[metromap.url].width}
          height={metromapsDetails[metromap.url].height}
          onFocusButtonClick={
            onFocusButtonClick(metromap.url)
            // pageState.current >= Math.max(...pageState.hist)
            //   ? onFocusButtonClick(metromap.url)
            //   : null
          }
          isMapFocused={
            focusState.map === metromap.url &&
            focusState.mode === FOCUS_MODE.FULL_VIEW
          }
          screenHeight={screenHeight}
          screenWidth={screenWidth}
          description={metromap.description}
          subtitle={metromap.subtitle}
          hint={metromap.hint}
          updateArticleAnimationDelayRef={updateArticleAnimationDelayRef}
          clearArticleAnimationDelayRef={clearArticleAnimationDelayRef}
          // metroLineShown={metroMapLineShown[metromap.url]}
          // updateMetroMapLineShown={updateMetroMapLineShown(metromap.url)}
          zoomOutButtonClicked={zoomOutButtonClicked}
        />
      </motion.div>
    );
  };

  // const [showQRCode, setShowQRCode] = useState(false);

  // console.log("pageState", pageState);

  const onBackToLandingPageButtonClick = () => {
    setStart(false);
  };

  const onNavigationButtonClick = (direction) => () => {
    if (direction === PAGE_DIRECTION.RIGHT) {
      setPageState(nextPageState(pageState));
    } else {
      setPageState(previousPageState(pageState));
    }
  };

  const timerNextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, Math.max(...oldPageState.hist) + 1), // move to next page after the farthest explored page in hist
      hist: oldPageState.hist.concat([oldPageState.current]),
      direction: 1,
      time: METROMAPS_TIME[
        Math.min(oldPageState.total - 1, Math.max(...oldPageState.hist))
      ],
    };
  };

  const pageStateIsValid =
    pageState.current != pageState.total &&
    pageState.current >= Math.max(...pageState.hist);

  const handleTimerUp = () => {
    focusState.mode = null;
    if (pageStateIsValid) {
      setPageState(timerNextPageState(pageState));
    }
  };

  return (
    <div>
      <motion.div className="timer">
        <Timer
          pageState={pageState}
          isValid={pageStateIsValid}
          onTimeUp={handleTimerUp}
        />
      </motion.div>

      <motion.div>
        {focusState.mode !== FOCUS_MODE.FULL_VIEW && (
          <motion.div className="header">
            <motion.div
              className="absolute top-0 left-0 mx-8 my-5 "
              style={{ height: HEADER_HEIGHT }}
            >
              <motion.div
                className="font-bold text-4xl"
                style={{ color: "#48a49e" }}
              >
                Australia's Discourse Explorer - User Study
              </motion.div>
              <motion.div
                className="italic text-xl line-clamp-1 font-medium"
                style={{ width: screenWidth / 2 }}
              >
                Discourse of equity, opportunity, and disadvantage in 2022
              </motion.div>
            </motion.div>
            <motion.div
              className="absolute top-0 right-0 flex justify-end items-center my-5"
              style={{ width: screenWidth / 2, height: HEADER_HEIGHT }}
            >
              <motion.img
                src={monashLogo}
                alt="Monash University Logo"
                style={{ height: HEADER_HEIGHT, paddingTop: 10 }}
              />
              <motion.img
                src={prfLogo}
                alt="PRF Logo"
                style={{ height: HEADER_HEIGHT }}
                className="mx-5"
              />
            </motion.div>
          </motion.div>
        )}
        <AnimatePresence>
          {metromaps
            .filter(
              (_, index) =>
                index / METROMAPS_PER_PAGE < pageState.current &&
                index / METROMAPS_PER_PAGE >= pageState.current - 1
            )
            .filter(
              // should only render the currently focused metromap OR if no map is on focus, render all metromaps on that page
              (metromap) =>
                (focusState.mode === FOCUS_MODE.FULL_VIEW &&
                  focusState.map === metromap.url) ||
                focusState.mode !== FOCUS_MODE.FULL_VIEW
            )
            .map((metromap) => renderMetroMap(metromap))}
        </AnimatePresence>
      </motion.div>

      <motion.div className="metro-interface">
        <MetroMapLegend
          isDisplayed={!(focusState.mode === FOCUS_MODE.FULL_VIEW)}
          initial={{
            x: 0,
            y: 0,
            width: 0,
            height: 0,
          }}
          animate={{
            x:
              focusState.mode === FOCUS_MODE.FULL_VIEW
                ? fullViewLegendX
                : noFullViewLegendX,
            y:
              focusState.mode === FOCUS_MODE.FULL_VIEW
                ? fullViewLegendY
                : noFullViewLegendY,
            width: legendWidth,
            height: 30,
          }}
        />
        <NavigationButton
          onClick={onZoomOutButtonClick}
          className={`right-[1%] top-[3%]`}
          isVisible={focusState.mode === FOCUS_MODE.FULL_VIEW}
        >
          <AiOutlineFullscreenExit size={40} />
        </NavigationButton>
        <NavigationButton
          onClick={onBackToLandingPageButtonClick}
          className={`left-[5%] top-[50%]`}
          isVisible={focusState.mode === null && pageState.current === 1}
        >
          Back to Intro
          <FaArrowAltCircleLeft size={40} />
        </NavigationButton>

        {/* Navigation Button between each session */}
        <NavigationButton
          onClick={onNavigationButtonClick(PAGE_DIRECTION.RIGHT)}
          className={`right-[5%] top-[50%] `}
          isVisible={
            focusState.mode === null && pageState.current !== pageState.total
          }
        >
          Next Map
          <FaArrowAltCircleRight size={40} color={"#b1babf"} />
        </NavigationButton>
        {/* <NavigationButton
        onClick={onNavigationButtonClick(PAGE_DIRECTION.LEFT)}
        className={`left-[25%] bottom-10 `}
        isVisible={focusState.mode === null}
      >
        <AiOutlineCaretLeft size={60} color={"#556170"} />
      </NavigationButton> */}
      </motion.div>

      {!(focusState.mode === FOCUS_MODE.FULL_VIEW) && renderSelectors()}
      {focusState.mode !== FOCUS_MODE.FULL_VIEW && (
        <motion.div className="metro-footer">
          <motion.div
            className="absolute left-0 bottom-0 mx-8 my-3 text-[9px]"
            style={{ maxWidth: flexMetroMapWidth, maxHeight: 56 }}
          >
            <motion.div className="underline">Data sources</motion.div>
            <motion.ul className="list-disc pl-5">
              <motion.li>
                Newspaper OpEd stories from all print media in Australia -
                Source from Factiva/Dow Jones
              </motion.li>
              <motion.li>
                Newspaper OpEd stories from most print media and online sources
                in Australia – Source NewsAPI (updated every few months)
              </motion.li>
            </motion.ul>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
