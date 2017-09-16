import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import NavigationBar from "./navigation/NavigationBar.Component";
import Home from "./pages/Home.Component";
import About from "./pages/About.Component";
import Contact from "./pages/Contact.Component";
import NodeNavigation from "./navigation/NodeNavigation.Component"

export default class WebView extends React.Component {
    public render() {
        return (
            <div className="mainContent">
                <NodeNavigation/>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                </Switch>
            </div>
        );
    }
}
