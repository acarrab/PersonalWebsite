import React from "react";
import { render } from "react-dom";
import WebView from "./WebView";
import { BrowserRouter as Router } from "react-router-dom";

render((
    <Router>
        <WebView />
    </Router>
), document.getElementById("app"));
