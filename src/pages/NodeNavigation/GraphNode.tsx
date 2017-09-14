import Node from "./Node"
const nodeOrientationBaseInRadians = 0;

export default class GraphNode extends Node {
    
        private connectedNodes:Array<Node>;
        private relativePlacement:Array<number>; // in radians
    
        private baseRadian: number;
    
        public constructor(index:number, originalDepth:number, baseRadian?:number) { 
            super(); 
            this.connectedNodes = [];
            this.relativePlacement = [];
    
            if (baseRadian !== undefined) {
                this.baseRadian = baseRadian;
            } else {
                this.baseRadian = nodeOrientationBaseInRadians;
            }
            
            this.depthOriginal = originalDepth;
            this.depthCurrent = originalDepth;
        }
    
    
        private depthOriginal: number;
        private depthCurrent: number;
        
        public getDepthOriginal(): number {
            return this.depthOriginal;
        }
        public getDepth(): number {
            return this.depthCurrent;
        }
        public setDepth(depth:number) {
            this.depthCurrent = depth;
        }
    
        
        private index: number = -1;
    
        public getIndex(): number {
            return this.index;
        }
    
    
        private partOfPath: boolean = false;
    
        public isPartOfPath():boolean {
            return this.partOfPath;
        }
        public setPartOfPath(state: boolean) {
            this.partOfPath = state;
        }
    }