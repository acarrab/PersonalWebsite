import React from "react";
import CanvasComponent from "./Canvas.Component";
import PropTypes from "prop-types";


export default class NodeNavigationComponent extends React.Component {
    render() {
        return (
            <div className="canvasContainer">
                <div className="canvasSizingDummy"></div>
                <CanvasComponent />
            </div>
        );
    }
}