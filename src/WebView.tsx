import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NodeNavigation from "./pages/nodeNavigation/CanvasNodes"

export default class WebView extends React.Component {
    constructor(props: {} | undefined) {
        super(props);
        NodeNavigation.start();
    }
    public render() {
        return (
            <div className="mainContent">
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                </Switch>
            </div>
        );
    }
}
