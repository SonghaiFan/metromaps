import React, { useState, useEffect } from "react";
import NavigationButton from "./NavigationButton";
import { FaArrowAltCircleRight } from "react-icons/fa";
import SelectorButton from "./SelectorButton";
import {
  TOTAL_SLIDES,
  PAGES,
  WelcomePage,
  FirstPage,
  ArticlePage,
  MetroStopPage,
  MetroLinesPage,
  FinalPage,
} from "./IntroPages";
import mixpanel from "mixpanel-browser";

// sample images
import mappng from "../img/map1.png";
import metrostop from "../img/metrostop.png";
import legend from "../img/legend.png";
import connection from "../img/connection.png";
import branching from "../img/branching.png";
import articles from "../img/articles.png";
import cover1 from "../img/cover1.png";
import cover2 from "../img/cover2.png";
import cover3 from "../img/cover3.png";
import cover4 from "../img/cover4.png";

const images = [cover1, cover2, cover3, cover4];

const randomIndex = Math.floor(Math.random() * images.length);
const randomImage = images[randomIndex];

export default function IntroMetroMapWrapper({ setStart }) {
  const [paginationState, setPaginationState] = useState({
    current: 1,
    total: TOTAL_SLIDES,
  });

  useEffect(() => {
    setPaginationState((previousPaginationState) => {
      return {
        ...previousPaginationState,
        current: 1,
      };
    });
  }, []);

  const onSelectorButtonClick = (n) => {
    mixpanel.track("Selector button clicked", { selectorID: n });
    setSelectedButton(n);
    setPaginationState((previousPageState) => {
      return {
        ...previousPageState,
        current: n,
      };
    });
  };

  const [selectedButton, setSelectedButton] = useState(1);

  const selectorButton = (n, s) => {
    return (
      <SelectorButton
        key={n}
        selectorID={n}
        onClick={() => {
          onSelectorButtonClick(n);
        }}
        isActive={s}
      />
    );
  };

  const renderSelectors = () => {
    let res = [];

    for (let i = 1; i <= TOTAL_SLIDES; i++) {
      res.push(selectorButton(i, i === selectedButton));
    }

    return (
      <div className="absolute bottom-10 w-full">
        <div className="text-white text-base mt-[3%] ">
          Tap here to progress through the user guide
        </div>
        <div className="flex">
          <div className="mt-[1%] flex">{res}</div>
        </div>
      </div>
    );
  };

  const selectPage = () => {
    switch (paginationState.current) {
      case PAGES.WELCOME:
        return {
          left: (
            <img
              className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
              src={randomImage}
              alt={randomImage}
            />
          ),
          right: <WelcomePage />,
        };
      case PAGES.FIRST:
        return {
          left: (
            <img
              className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
              src={mappng}
              alt="Sample metromap"
            />
          ),
          right: <FirstPage />,
        };
      case PAGES.ARTICLE:
        return {
          left: (
            <>
              <img
                src={articles}
                className="absolute left-[28%] max-w-[45%] max-h-[40%] translate-x-[-50%] top-[40%] translate-y-[-50%]"
                alt="Sample articles"
              />
              <img
                src={metrostop}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[70%] translate-y-[-50%]"
                alt="Sample station"
              />
            </>
          ),
          right: <ArticlePage />,
        };
      case PAGES.METROSTOP:
        return {
          left: (
            <>
              <img
                src={legend}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[30%] translate-y-[-50%]"
                alt="Metromap legend"
              />
              <img
                src={connection}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[50%] translate-y-[-50%]"
                alt="Sample stations"
              />
            </>
          ),
          right: <MetroStopPage />,
        };
      case PAGES.METROLINES:
        return {
          left: (
            <>
              <img
                src={branching}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
                alt="Sample metromap"
              />
            </>
          ),
          right: <MetroLinesPage />,
        };
      case PAGES.FINAL:
        return {
          left: (
            <>
              <img
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[47%] translate-y-[-50%]"
                src={mappng}
                alt="Sample metromap"
              />
              <img
                src={legend}
                className="absolute left-[28%] max-w-[45%] translate-x-[-50%] top-[77%] translate-y-[-50%]"
                alt="Metromap legend"
              />
            </>
          ),
          right: <FinalPage />,
        };

      default:
        return;
    }
  };

  const page = selectPage();

  return (
    <>
      <div className="h-[100vh] w-[100vw] flex overflow-hidden absolute top-0 left-0">
        <div className="w-1/2 m-[3%]">{page.left}</div>
        <div className="w-2/5 m-[3%] pr-[10%]">
          <div>{page.right}</div>
          <div>{renderSelectors()}</div>
          {selectedButton === TOTAL_SLIDES && (
            <NavigationButton
              onClick={() => setStart(true)}
              className={`right-[2%] top-[50%]`}
              isVisible={true}
            >
              Start
              <FaArrowAltCircleRight size={40} />
            </NavigationButton>
          )}
        </div>
      </div>
    </>
  );
}
