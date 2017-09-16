export interface Drawable {
    draw(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D):boolean;
}
export interface Updateable extends Drawable {
    update(width:number, height:number):void;
}

const maxDelayInSeconds = 5;
const maxDelay = maxDelayInSeconds * 1000;

/**
 * draws all updateables in list then returns whether any of them were updated
 * @param drawables list of updateable elements for drawing
 * @param canvas canvas element
 * @param ctx rendering context
 */
export function drawAll(drawables: Array<Drawable>, canvas:HTMLCanvasElement, ctx: CanvasRenderingContext2D):boolean {
    var wasUpdate = false;
    drawables.forEach(element => {
        if (element.draw(canvas, ctx)) {
            wasUpdate = true;
        }
    });
    return wasUpdate;
}

/**
 * Process that slows down the more it is told that nothing was updated. Every time it does not update something,
 *  it increases time between updates by 10%, but up to 5 seconds.
 */
export class ExciteableProcess {
    
    cancelRequest:Array<boolean>;
    loopCallDelay:number;
    loopCallDelayScalar:number;
    callback:()=>boolean;
    /**
     * @param callbackFunc specified function to repeatedly call in loop
     * @param loopCallDelay how long to wait between calls
     */
    constructor(callbackFunc:() => boolean, loopCallDelay:number) {
        this.callback = callbackFunc;
        this.loopCallDelay = loopCallDelay;
        this.loopCallDelayScalar = .9;
        this.cancelRequest = [false];
        this.eventLoop(this.cancelRequest);
    }
    
    
    private eventLoop(cancelRequested:Array<boolean>) {
        if (cancelRequested[0]) {
            return;
        }
        // if the call back did something
        if (this.callback()) {
            this.loopCallDelayScalar = 1;
        } else if (this.loopCallDelayScalar < maxDelay){
            this.loopCallDelayScalar *= 1.1;
        }
        var processThis = this;
        setTimeout(() => { processThis.eventLoop(cancelRequested); }, this.loopCallDelay * this.loopCallDelayScalar);
    }
    
    /**
     * kills this process
     */
    public kill():void {
        this.cancelRequest[0] = true;
        // remove reference so we dont interfere with message
        this.cancelRequest = this.cancelRequest.slice();
    }
    
    /**
     * tells you whether process is alive
     */
    public isAlive():boolean {
        // we are alive if we have not been canceled
        return !this.cancelRequest[0]
    }
    /** 
     * resets the slow loop, or starts the loop
     */
    public excite() {
        this.cancelRequest[0] = true;
        this.cancelRequest = [false];
        this.loopCallDelayScalar = .9;
        this.eventLoop(this.cancelRequest);
    }
}
