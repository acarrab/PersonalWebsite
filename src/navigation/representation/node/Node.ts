
const positionTransitionTime = 500;//ms
const radiusTransitionTime = 500;//ms
const swellTransitionTime = 100;//ms

class TransitionValue {

    private transitionTime: number;

    private valueOld: number;
    private valueNew: number;

    private transitionStart: number;


    private partition(progress: number, start: number, end: number): number {
        return progress * end + (1.0 - progress) * start;
    }

    public set(value: number): void {
        this.transitionStart = Date.now();
        this.valueOld = this.valueNew;
        this.valueNew = value;
    }

    public get(): number {
        let timeInMs: number = Date.now();
        if (this.transitionStart + this.transitionTime < timeInMs) {
            // We are done with transition
            return this.valueNew;
        }
        let progress: number = (timeInMs - this.transitionStart) / this.transitionTime;
        return progress * this.valueNew + (1.0 - progress) * this.valueOld;
    }

    public constructor(transitionTime: number, initialValue: number) {
        this.transitionTime = transitionTime;
        this.transitionStart = 0;
        
        this.valueNew = initialValue;
    }
}

export class Point {
    public x:number;
    public y:number;
    public constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }
}

export default class Node {

    private x: TransitionValue = new TransitionValue(positionTransitionTime, 0);
    private y: TransitionValue = new TransitionValue(positionTransitionTime, 0);
    private radius: TransitionValue = new TransitionValue(radiusTransitionTime, 1);

    private swell: TransitionValue = new TransitionValue(swellTransitionTime, 1);

    public getPosition(): Point {
        return new Point(this.x.get(), this.y.get());
    }

    public getRadius(): number {
        return this.radius.get();
    }

    public setPosition(x: number, y: number): void {
        this.x.set(x);
        this.y.set(y);
    }

    public setRadius(radius: number): void {
        this.radius.set(radius);
    }

    public setSwell(sizeMultiplier: number): void {
        this.swell.set(sizeMultiplier);
    }

}
