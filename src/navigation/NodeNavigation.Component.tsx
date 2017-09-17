import React from "react";
import CanvasComponent from "./Canvas.Component";
import PropTypes from "prop-types";
import Measure from "react-measure";

interface NodeNavigationComponentState {
    widthToHeightRatio: number;

}

const RESOLUTION = 1000;


interface SizeState {
    heightToWidthRatio: number;
}

// used to update canvas size change on webpage to keep known ratios the same
class SizeTrackedCanvas extends React.Component {
    state: SizeState;
    render() {
        this.state = {
            heightToWidthRatio: 1
        }
        return (
            <Measure
                bounds
                onResize={
                    ({ bounds }) => {
                        console.log(bounds);
                        if (bounds !== undefined) { this.setState({ heightToWidthRatio: RESOLUTION / bounds.width }); }
                    }
                }>
                {({ measureRef }) => <div ref={measureRef}> <CanvasComponent widthToHeightRatio={this.state.heightToWidthRatio} resolution={RESOLUTION} fps={25} /></div>}
            </Measure>
        )
    }
}


export default class NodeNavigationComponent extends React.Component {
    render() {
        return (
            <div>
                <SizeTrackedCanvas />
            </div>
        );
    }
}

