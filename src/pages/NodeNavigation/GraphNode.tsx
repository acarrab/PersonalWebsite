import Node from "./Node"
export const nodeOrientationBaseInRadians = 0;

export class GraphNode extends Node {
    
        private connectedNodes:Array<Node>;
        private relativePlacement:Array<number>; // in radians
    
        public addNode(node:Node, relativePlacement:number) {
            this.connectedNodes.push(node);
            this.relativePlacement.push(relativePlacement);
        }

        public forEachNode(transform:(node:Node, radian:number) => void) {
            this.connectedNodes.forEach((node, index) => { transform(node, this.relativePlacement[index])});
        }
        
        private baseRadian: number;
    
        public constructor(depthOriginal:number, baseRadian:number = nodeOrientationBaseInRadians) { 
            super(); 
            this.connectedNodes = [];
            this.relativePlacement = [];
    
            this.baseRadian = baseRadian;
            
            this.depthOriginal = depthOriginal;
            this.depthCurrent = depthOriginal;
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
            if (this.depthOriginal === null) {
                this.depthOriginal = depth;
            }
            this.depthCurrent = depth;
        }
    
    
        private partOfPath: boolean = false;
    
        public isPartOfPath():boolean {
            return this.partOfPath;
        }
        public setPartOfPath(state: boolean) {
            this.partOfPath = state;
        }
    }