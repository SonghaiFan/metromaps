import React from "react";
import NavigationButton from "./NavigationButton";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft } from "react-icons/fa";

const NavigationBar = ({
  currentPage,
  totalPages,
  handleNext,
  handlePrev,
  isConfirmed,
}) => {
  return (
    <div className="navigation-bar flex justify-between">
      <div>
        {" "}
        <NavigationButton
          onClick={handlePrev}
          // className={`left-[1%]`}
          isVisible={currentPage > 1}
        >
          <FaArrowAltCircleLeft size={40} />
        </NavigationButton>
      </div>

      <div className="text-yellow-400">{currentPage + "/" + totalPages}</div>
      <div>
        {" "}
        <NavigationButton
          onClick={handleNext}
          // className={`left-[1%]`}
          isVisible={currentPage < totalPages && isConfirmed}
        >
          <FaArrowAltCircleRight size={40} />
        </NavigationButton>
      </div>
    </div>
  );
};

export default NavigationBar;
