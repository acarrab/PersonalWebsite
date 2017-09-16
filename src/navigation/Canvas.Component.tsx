import React from "react";
import { ExciteableProcess, Updateable, drawAll } from "../Process";
import CanvasGraph from "./representation/graph/CanvasGraph";
import Pages from "../pages/Pages";
import { withRouter } from "react-router";

const fps: number = 25.0;
const msPerFrame = 1000 / fps;

const baseSize = 1000;

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
    
    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;

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

interface CanvasState {
    width: number;
    height: number;
}
interface Location {
    pathname: string
}
interface History {
    location: Location
}
interface CanvasProps {
    history?: History;
}

class CanvasComponent extends React.Component<CanvasProps> {
    controller: CanvasController;
    state: CanvasState;
    canvas: HTMLCanvasElement;
    props: CanvasProps;
    constructor() {
        super();
        this.state = {
            width: 1000,
            height: 1000
        };
    }
    componentDidMount() {
        let canvasTemp = this.refs.canvas;
        if (canvasTemp instanceof HTMLCanvasElement) {
            this.canvas = canvasTemp;
        } else {
            throw new Error("No such canvas");
        }
        this.controller = new CanvasController(this.canvas);
        window.addEventListener("resize", this.update.bind(this));
        this.update();
    }
    
    componentWillUnmount() {
        window.removeEventListener("resize", this.update.bind(this));
    }

    componentWillReceiveProps() {
        console.log(this.props);
        if (this.props.history !== undefined) {
            console.log("RECIEVED PROP");
            console.log(this.props.history.location.pathname);
        }
        this.update()
    }
    update(): void {
        let w = this.canvas.clientWidth;
        let h = this.canvas.clientHeight;
        // height  always stays the same
        this.setState({ width: baseSize * w / h });
        if (this.props.history !== undefined) {
            Pages.getInstance().setCurrentRoute(this.props.history.location.pathname);
        } else {
            // should not happen
            Pages.getInstance().setCurrentRoute("/");
        }
        
        this.controller.update();
    }
    public render() {
        return (
            <canvas ref="canvas" width={this.state.width} height={this.state.height} />
        );
    }
}
export default withRouter(CanvasComponent);