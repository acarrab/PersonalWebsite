import React from "react";
import CanvasComponent from "./Canvas.Component";
import PropTypes from "prop-types";
import { withRouter } from "react-router";


interface Location extends Object {
    pathname: string;
}

interface RouteTracker {
    location?: Location;
}

class NodeNavigationComponent extends React.Component<RouteTracker> {
    static propTypes: object;
    state:Location;
    constructor() {
        super();
        this.state = {
            pathname: "/"
        };
    }
    componentWillReceiveProps() {
        if (this.props.location !== undefined) {
            this.setState({ pathname: this.props.location.pathname })
        }
    }
    
    render() {
        if (this.props.location === undefined) {
            throw new Error("Location was not defined")
        }
        return (
            <div className="canvasContainer">
                <div className="canvasSizingDummy"></div>
                <CanvasComponent path={this.props.location.pathname}/>
            </div>
        );
    }
}

NodeNavigationComponent.propTypes = {
  match: PropTypes.object.isRequired
};
export default withRouter(NodeNavigationComponent);