import React, { useState } from "react";
import Menu from "./components/Menu";
import IntroMetroMapWrapper from "./components/IntroMetroMapWrapper";
import METROMAPS from "./utilities/metromaps";
import { useWindowSize } from "react-use";

export default function App() {
  const [start, setStart] = useState(false);

  const { width, height } = useWindowSize();

  return (
    <div>
      {start ? (
        <Menu
          metromaps={METROMAPS}
          width={width}
          height={height}
          setStart={setStart}
        />
      ) : (
        <IntroMetroMapWrapper setStart={setStart} />
      )}
    </div>
  );
}
