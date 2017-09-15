export interface Updateable {
    draw(canvas:HTMLCanvasElement, context:CanvasRenderingContext2D):boolean;
    update():void;
}



export class ExciteableProcess {
    
    cancellationToken:boolean;
    loopCallDelay:number;
    loopCallDelayScalar:number;
    callback:()=>void;
    
    constructor(callbackFunc:() => boolean, loopCallDelay:number) {
        this.callback = callbackFunc;
        this.loopCallDelay = loopCallDelay;
        this.loopCallDelayScalar = 1;
        this.eventLoop();
    }
    
    private eventLoop() {
        if (this.cancellationToken) return;
        // if the call back did something
        if (this.callback()) {
            this.loopCallDelayScalar = 1;
        } else if (this.loopCallDelayScalar < 60 * 1000){
            this.loopCallDelayScalar *= 1.2;
        }
        var processThis = this;
        setTimeout(() => { processThis.eventLoop(); }, this.loopCallDelay * this.loopCallDelayScalar);
    }
    
    /**
     * kills this process
     */
    public kill():void {
        this.cancellationToken = true;
    }
    
    /**
     * tells you whether process is alive
     */
    public isAlive():boolean {
        return !this.cancellationToken;
    }
    /** 
     * returns whether process is active still
     */
    public excite():boolean {
        this.loopCallDelayScalar = 1;
        return this.isAlive();
    }
}
