import React from "react";
import { ExciteableProcess, Updateable } from "./process";

const fps: number = 25;
const msPerFrame = 1000 / fps;


class CanvasController {
    
        canvas: HTMLCanvasElement;
        process: ExciteableProcess;
        updateables: Array<Updateable>;
        
        constructor(canvas: HTMLCanvasElement | null | React.ReactInstance) {
            if (canvas instanceof HTMLCanvasElement) {
                this.canvas = canvas;
            }
            this.updateables = [];
            var myThis = this;
            this.process = new ExciteableProcess(() => { 
                var wasChange:boolean = false;
                this.updateables.forEach(element => {
                    if (element.draw(myThis.canvas)) {
                        wasChange = true;
                    }
                });
                return wasChange;
            }, msPerFrame);
        }
    
        /**
         * update variables because of change
         */
        public update() {
            this.updateables.forEach(element => {
               element.update(); 
            });
            this.process.excite();
        }
    
        /**
         * add object that will be called to update and draw
         * You must explicitly call update after adding
         * @param updateable Updateable object
         */
        public add(updateable:Updateable) {
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
