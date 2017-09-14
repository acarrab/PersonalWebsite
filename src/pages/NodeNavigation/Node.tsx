import Point from "./Point";
import { CanvasDrawable } from "./Artist";

const positionTransitionTime = 500;//ms
const radiusTransitionTime = 500;//ms
const swellTransitionTime = 100;//ms



function partition(progress:number, start:number, end: number) {
    return progress * end + (1.0 - progress) * start;
}



class TransitionValue {
    private transitionTime: number;
    
    private valueOld: number;
    private valueNew: number;
    
    private transitionStart: number;
    

    private partition(progress:number, start:number, end: number): number {
        return progress * end + (1.0 - progress) * start;
    }
    
    public set(value:number):void {
        this.transitionStart = Date.now();
        this.valueOld = this.valueNew;
        this.valueNew = value;
    }
    public get():number {
        let timeInMs:number = Date.now();
        if (this.transitionStart + this.transitionTime < timeInMs) {
            // We are done with transition
            return this.valueNew;
        }
        let progress:number = (timeInMs - this.transitionStart) / this.transitionTime;
        return progress * this.valueNew + (1.0 - progress) * this.valueOld;
    }
    public constructor(transitionTime:number) {
        this.transitionTime = transitionTime;
    }
}

export default class Node implements CanvasDrawable {
    draw(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        let pos = this.getPosition();
        ctx.arc(pos.x, pos.y, this.getRadius(), 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.lineWidth = 5;
        ctx.strokeStyle = "orange";
        ctx.stroke();
    }

    private x: TransitionValue = new TransitionValue(positionTransitionTime);
    private y: TransitionValue = new TransitionValue(positionTransitionTime);
    private radius: TransitionValue = new TransitionValue(radiusTransitionTime);
    private swell: TransitionValue = new TransitionValue(swellTransitionTime);
    
    public getPosition():Point {
        return new Point(this.x.get(), this.y.get());
    }

    public getRadius():number {
        return this.radius.get() * this.swell.get();
    }

    public setPosition(x:number, y:number):void {
        this.x.set(x);
        this.y.set(y);
    }

    public setRadius(radius:number):void {
        this.radius.set(radius);
    }

    public setSwell(sizeMultiplier:number):void {
        this.swell.set(sizeMultiplier);
    }

}

