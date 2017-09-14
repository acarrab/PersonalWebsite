import React from "react";
import { CanvasGraph } from "./Graph";
import { Page } from "../Pages";

var fps: number = 25;
var size = 0;

var borderColor = "#ebd9c7"; "linen"; "#38ACEC";
var backColor = "#FF533D"; "orange"; "#a338ec";//"#F62217";
var speckColor = "linen";
var canvasColor = "#0F1626";


const canvasId: string = "navigationNodesCanvas";

const resolution = 200;

class wheelHighlights {
    static lineColor: string = "#FF533D";
    static nonFocusColor: string = "#101010";
    static focusColor: string = "#6d6d72";
};


class GetCanvas extends React.Component {
    private pages:CanvasGraph;
    public constructor() {
        super();
        var canvas:any = document.getElementById(canvasId);
        if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
            console.error("canvas does not exist yet")
            throw new Error("No canvas");
        }
        this.pages = new CanvasGraph(canvas, resolution, resolution);
        this.pages.update(Page.homePage);
        
        var ctx = canvas.getContext("2d");
        if (ctx === null || !(ctx instanceof CanvasRenderingContext2D)) {
            console.error("Could not get rendering context");
            throw new Error("No CanvasRenderingContext2D");
        }
        this.pages.draw(canvas, ctx);
    }
    render() {
        return (<div></div>);
    }
}
export default class NodeNavigation extends React.Component {
    public render() {
        return (
            <div>
            <canvas
                id={canvasId}
                width="100"
                height="100"
                style={{
                    width: resolution + "px",
                    height: resolution + "px"
                }}>
            </canvas>
            <GetCanvas/>
            </div>
            
        );
    }
}
