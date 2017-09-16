import React from "react";
import CanvasComponent from "./Canvas.Component";
import PropTypes from "prop-types";
import Measure from "react-measure";

interface NodeNavigationComponentState {
    widthToHeightRatio: number;

}

const RESOLUTION = 1000;


interface SizeState {
    widthToHeightRatio: number;
}
class SizeTrackedCanvas extends React.Component {
    state: SizeState;
    render() {
        this.state = {
            widthToHeightRatio: 1
        }
        return (
            <Measure
                bounds
                onResize={
                    ({ bounds }) => {
                        if (bounds !== undefined) { this.setState({ widthToHeightRatio: bounds.width / RESOLUTION }); }
                        console.log(bounds);
                    }
                }>
                {({ measureRef }) => <div ref={measureRef}> <CanvasComponent widthToHeightRatio={this.state.widthToHeightRatio} resolution={RESOLUTION} fps={25} /></div>}
            </Measure>
        )
    }
}


export default class NodeNavigationComponent extends React.Component {
    render() {
        return (
            <div className="canvasContainer">
                <div className="canvasSizingDummy"></div>
                <SizeTrackedCanvas />
            </div>
        );
    }
}

