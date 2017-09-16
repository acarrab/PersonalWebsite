import React from "react";
import { ExciteableProcess, Updateable, drawAll } from "../Process";
import CanvasGraph from "./representation/graph/CanvasGraph";
const fps: number = 25.0;
const msPerFrame = 1000 / fps;


class CanvasController {

    graph: CanvasGraph;
    
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    process: ExciteableProcess;
    updateables: Array<Updateable>;

    private createUpdateables() {
        this.graph = new CanvasGraph();
        this.updateables = [
            this.graph
        ];
    }
    
    constructor(canvas: HTMLCanvasElement | null | React.ReactInstance) {
        if (canvas instanceof HTMLCanvasElement) {
            this.canvas = canvas;
        } else {
            throw new Error("No such canvas");
        }

        let intermediateContext = this.canvas.getContext("2d");
        if (intermediateContext instanceof CanvasRenderingContext2D) {
            this.ctx = intermediateContext;
        } else {
            throw new Error("No such context");
        }
        
        this.createUpdateables();
        
        var myThis = this;
        this.process = new ExciteableProcess((): boolean => { 
            this.ctx.clearRect(-100, -100, this.canvas.width + 200, this.canvas.height + 200);
            return drawAll(myThis.updateables, myThis.canvas, myThis.ctx); 
        }, msPerFrame);
        this.update();
    }

    /**
     * update variables because of change
     */
    public update() {
        this.updateables.forEach(element => {
            element.update(this.canvas.width, this.canvas.height);
        });
        // reset speed to do transitions
        this.process.excite();
    }

    /**
     * add object that will be called to update and draw
     * You must explicitly call update after adding
     * @param updateable Updateable object
     */
    public add(updateable: Updateable) {
        this.updateables.push(updateable);
    }
}

export default class CanvasComponent extends React.Component {
    controller: CanvasController;
    componentDidMount() {
        this.update();
    }
    update(): void {
        var canvas = this.refs.canvas;
        if (this.controller === undefined) {
            this.controller = new CanvasController(canvas);
        }

    }
    public render() {
        return (
            <canvas ref="canvas" width={1000} height={1000} />
        );
    }
}
