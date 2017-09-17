import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";
import NavigationBar from "./navigation/NavigationBar.Component";
import Home from "./pages/Home.Component";
import About from "./pages/About.Component";
import Contact from "./pages/Contact.Component";
import NodeNavigation from "./navigation/NodeNavigation.Component"

class Test extends React.Component {
    private myId: number;
    constructor(n: number) {
        super();
        this.myId = n;
    }

    render() {
        return (
            <div>
                <h1> Test page #{this.myId}</h1>
            </div>
        );
    }
}

function GetTest(n: number) {
    class Testing extends Test {
        constructor() {
            super(n);
        }
    }
    return Testing;
}
function WebsitePages() {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/test1" component={GetTest(1)} />
            <Route path="/test2" component={GetTest(2)} />
            <Route path="/test3" component={GetTest(3)} />
            <Route path="/test4" component={GetTest(4)} />
            <Route path="/test5" component={GetTest(5)} />
        </Switch>
    );
}
export default class WebView extends React.Component {
    public render() {
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className="col-sm-8">
                        <div className="mainContent">
                            <WebsitePages />
                        </div>
                    </div>

                    <div className="col-sm-4">
                        <NodeNavigation />
                    </div>
                </div>
            </div>
        );
    }
}
