import React from "react";
import { render } from "react-dom";
import WebView from "./WebView";

const App = () => (<WebView />);

render((<App />), document.getElementById("app"));
