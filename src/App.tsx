import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import WebView from "./WebView";

render((
    <Router>
        <div>
            <NavigationBar />
            <WebView />
        </div>
    </Router>
), document.getElementById("app"));
