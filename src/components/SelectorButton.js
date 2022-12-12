import React, { useState } from "react";

export default function SelectorButton({ selectorID, onClick, isActive }) {
  const initialStyleState = {
    backgroundColor: "bg-black",
    color: "text-white",
    fontWeight: "font-normal",
  };

  const [styleState, setStyleState] = useState(initialStyleState);

  const className = `w-10 h-10 flex items-center justify-center rounded-full border-2 border-white-500 ml-2 select-none ${
    isActive
      ? "bg-white text-black font-bold"
      : `${styleState.backgroundColor} ${styleState.color} ${styleState.fontWeight}`
  }`;

  const onMouseOver = () => {
    setStyleState({
      backgroundColor: "bg-white",
      color: "text-black",
      fontWeight: "font-bold",
    });
  };

  const onMouseOut = () => {
    setStyleState(initialStyleState);
  };

  const onMouseDown = () => {
    setStyleState({
      backgroundColor: "bg-black",
      color: "text-grey",
      fontWeight: "font-normal",
    });
  };

  const onMouseUp = () => {
    setStyleState({
      backgroundColor: "bg-white",
      color: "text-black",
      fontWeight: "font-bold",
    });
  };

  return (
    <div
      id={"selector" + selectorID}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onClick={onClick}
      className={className}
    >
      {selectorID}
    </div>
  );
}
