import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import NavigationBar from "./navigation/NavigationBar.Component";
import WebView from "./WebView.Component";


//should make basename dynamically determined from uri
/*basename="/~acarrab">*/
render((
    <Router>
        <div>
            <NavigationBar />
            <WebView />
        </div>
    </Router>
), document.getElementById("app"));
