import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";

export default class WebView extends React.Component {
    public render() {
        return (
            <div className="MainContent">
                <NavigationBar />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                </Switch>
            </div>
        );
    }
}
