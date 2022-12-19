import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import mixpanel from 'mixpanel-browser';


mixpanel.init('xxxxxxxxxxxxxxxxxxxxxxxxxxxxx' // <- Change this
  , {debug: true, ignore_dnt: true}); 
mixpanel.track('User landing');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
