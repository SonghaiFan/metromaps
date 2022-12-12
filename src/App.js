import React from "react";
import Menu from "./components/Menu";
import METROMAPS from "./utilities/metromaps";
import { useWindowSize } from "react-use";

export default function App() {
  const { width, height } = useWindowSize();

  return (
    <div>
      <Menu
        metromaps={METROMAPS}
        width={width}
        height={height}
        introMetroMapUrl="intro"
      />
    </div>
  );
}
