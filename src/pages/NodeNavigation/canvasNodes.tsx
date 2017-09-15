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

class wheelHighlights {
    static lineColor: string = "#FF533D";
    static nonFocusColor: string = "#101010";
    static focusColor: string = "#6d6d72";
};

class CanvasController {

    private pages:CanvasGraph;
    private width:number;
    private height:number;

    private canvas:HTMLCanvasElement;
    private context:CanvasRenderingContext2D;

    public constructor() {

        var canvas:any = document.getElementById(canvasId);
        if (canvas === null || !(canvas instanceof HTMLCanvasElement)) {
            console.error("canvas does not exist yet")
            throw new Error("No canvas");
        }

        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;
        
        this.pages = new CanvasGraph(canvas, this.width, this.height);

        var ctx = canvas.getContext("2d");
        if (ctx === null || !(ctx instanceof CanvasRenderingContext2D)) {
            console.error("Could not get rendering context");
            throw new Error("No CanvasRenderingContext2D");
        }
        this.context = ctx;
        

        this.update();
        this.draw();
    }
    public draw() {
        this.pages.draw(this.canvas, this.context);
    }
    public update() {
        this.pages.update(Page.homePage);   
    }
    private test() {
        var ctx = this.context;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(this.width, this.height);
        ctx.strokeStyle = "green";
        ctx.stroke();
    }
    
}


class CanvasProcess {
    private canvasController:CanvasController;
    private mainLoop() {
        var myThis = this;
        this.canvasController.draw();
        setTimeout(() => { myThis.mainLoop(); }, 1000);
    }
    constructor() {
        this.canvasController = new CanvasController();
        this.mainLoop();
    }
}


export default class NodeNavigation {
    static canvasMaintainer:CanvasProcess;
    static start() {
        NodeNavigation.canvasMaintainer = new CanvasProcess();
    }
}
