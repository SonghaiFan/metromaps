import React, { useReducer, useMemo, useState, useRef, useEffect } from "react";
import MetroMap from "./MetroMap";
import { loadData } from "../utilities/loadData";
import {
  ACTION_TYPES,
  FOCUS_MODE,
  metroMapContainerVariantsFactory,
  getAnimateState,
} from "../utilities/menuUtilities";
import { AnimatePresence, motion } from "framer-motion";
import NavigationButton from "./NavigationButton";
import IntroMetroMapWrapper from "./IntroMetroMapWrapper";
import MetroMapLegend from "./MetroMapLegend";
import SelectorButton from "./SelectorButton";
import {
  AiOutlineFullscreenExit,
  AiOutlineCaretLeft,
  AiOutlineCaretRight,
} from "react-icons/ai";
import { margin } from "../utilities/util";
import monashLogo from "../img/logo_monash_black.6bfe21bb.png";
import prfLogo from "../img/Logo-PRF.png";
import { ReactComponent as QRCode } from "../img/qrCode.svg";
import { MdClose } from "react-icons/md";
import Timer from "./Timer";
import { FaArrowAltCircleLeft } from "react-icons/fa";

const METROMAPS_PER_PAGE = 1;
const HEADER_HEIGHT = 80;

const PAGE_DIRECTION = {
  RIGHT: 1,
  LEFT: -1,
};

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
  const metroMapsY = (screenHeight - HEADER_HEIGHT - metroMapHeight) / 2;

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
    total: Math.ceil(metromaps.length / METROMAPS_PER_PAGE),
    direction: PAGE_DIRECTION.RIGHT,
  });

  const renderSelectors = () => {
    let numbersToRender = [];
    if (pageState.total <= 5) {
      numbersToRender = Array(pageState.total)
        .fill(1)
        .map((value, index) => value + index);
    } else if (pageState.current >= 5) {
      numbersToRender =
        pageState.current + 1 > pageState.total
          ? [
              pageState.current - 3,
              pageState.current - 2,
              pageState.current - 1,
              pageState.current,
            ]
          : [
              pageState.current - 3,
              pageState.current - 2,
              pageState.current - 1,
              pageState.current,
              pageState.current + 1,
            ];
    } else {
      numbersToRender = [1, 2, 3, 4, 5];
    }

    return (
      <div className="absolute bottom-0 w-screen ">
        <div className="flex w-[100%] justify-center items-center">
          <div className="m-[1%] flex">
            {numbersToRender.map((pageNumber) => {
              return (
                <SelectorButton
                  key={pageNumber}
                  selectorID={pageNumber}
                  isActive={pageState.current === pageNumber}
                  onClick={() =>
                    setPageState((previousPageState) => {
                      return {
                        ...previousPageState,
                        current: pageNumber,
                        direction:
                          previousPageState.current < pageNumber
                            ? PAGE_DIRECTION.RIGHT
                            : PAGE_DIRECTION.LEFT,
                      };
                    })
                  }
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
    console.log("focusState", focusState);
  };

  const articleAnimationDelayRef = useRef();
  const [zoomOutButtonClicked, setZoomOutButtonClicked] = useState(false);
  useEffect(() => {
    if (focusState.mode === null) {
      setZoomOutButtonClicked(false);
    }
  }, [focusState.mode]);

  const updateArticleAnimationDelayRef = (timeoutId) => {
    console.log("assigning");
    articleAnimationDelayRef.current = timeoutId;
  };

  const clearArticleAnimationDelayRef = () => {
    if (articleAnimationDelayRef.current) {
      console.log("clearing");
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
          onFocusButtonClick={onFocusButtonClick(metromap.url)}
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

  const nextPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.min(oldPageState.total, oldPageState.current + 1),
      direction: PAGE_DIRECTION.RIGHT,
    };
  };

  const previousPageState = (oldPageState) => {
    return {
      ...oldPageState,
      current: Math.max(1, oldPageState.current - 1),
      direction: PAGE_DIRECTION.LEFT,
    };
  };

  return (
    <div>
      <Timer
        setPageState={() => setPageState(nextPageState(pageState))}
        resetZoom={onZoomOutButtonClick}
      />
      <motion.div>
        {focusState.mode !== FOCUS_MODE.FULL_VIEW && (
          <>
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
          </>
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
        onClick={() => setStart(false)}
        className={`left-[2%] top-[50%]`}
        isVisible={focusState.mode === null}
      >
        Back to Intro
        <FaArrowAltCircleLeft size={40} />
      </NavigationButton>

      {/* Navigation Button between each session */}
      <NavigationButton
        onClick={() => setPageState(nextPageState(pageState))}
        className={`right-[25%] top-[90%] z-20`}
        isVisible={focusState.mode === null}
      >
        <AiOutlineCaretRight size={60} />
      </NavigationButton>
      <NavigationButton
        onClick={() => setPageState(previousPageState(pageState))}
        className={`left-[25%] top-[90%] z-20`}
        isVisible={focusState.mode === null}
      >
        <AiOutlineCaretLeft size={60} />
      </NavigationButton>

      {!(focusState.mode === FOCUS_MODE.FULL_VIEW) && renderSelectors()}
      {focusState.mode !== FOCUS_MODE.FULL_VIEW && (
        <>
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
        </>
      )}
    </div>
  );
}
