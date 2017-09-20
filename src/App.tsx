import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationBar from "./navigation/NavigationBar.Component";
import WebView from "./WebView.Component";

var baseUrl = "/~acarrab/#/"; // my base url for school web page

if (process.env.NODE_ENV === 'development') {
    baseUrl = "/#/";
}
render((
    <Router basename={baseUrl}>
        <div>
            <NavigationBar />
            <WebView />
        </div>
    </Router>
), document.getElementById("app"));
