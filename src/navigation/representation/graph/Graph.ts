import GraphNode from "../node/GraphNode";
import { Updateable } from "Process";


// keeps value between 0 and 1 up to a certain depth, because that probably looks nicer
class GeometricSeriesCap {
    private ratio:number;
    private max:number;
    public transform(value:number, depth:number):number {
        return value * Math.pow(this.ratio, depth) / this.max;
    }
    public constructor(ratio:number, guaranteedSeeingDepth:number) {
        this.ratio = ratio;
        this.max = 0;
        for (let i = 1; i <= guaranteedSeeingDepth; i++) {
            this.max += Math.pow(ratio, i);
        }
    }
}

const depth1 = 10;
const radiusTransformer = new GeometricSeriesCap(.8, depth1);
const depth2 = 5;
const distanceTransformer = new GeometricSeriesCap(.8, depth2);


export default class Graph {

    private radiusBase:number;
    private distanceBase:number;
    
    private alternatingTrue:boolean;

    private lastComputedEdges:Array<[GraphNode, GraphNode]>;
    
    private update_Recursive(node: GraphNode, x:number, y:number, depth:number): boolean {
        // We visit every node at least once and set it's distance if possible.
        if (node.wasVisited !== this.alternatingTrue) {
            node.wasVisited = this.alternatingTrue;
            node.setDepth(depth);
            node.setRadius(radiusTransformer.transform(this.radiusBase, depth));
            node.setPosition(x, y);
            let distance = distanceTransformer.transform(this.distanceBase, depth);
            //nodes are guaranteed, by us before, to have parent as first node, so we can ignore that possible problem here
            node.forEachNode((other: GraphNode, radians: number) => {
                let theirX = x + Math.cos(radians) * distance;
                let theirY =  y + Math.sin(radians) * distance;
                if(this.update_Recursive(other, theirX, theirY, depth + 1)) {
                    this.lastComputedEdges.push([node, other]);
                    other.setPartOfPath(other.isInversion(node));
                }
            });
            return true;
        }
        return false;
    }
    
    /**
     * 
     * @param width canvas width
     * @param height canvas height
     * @param headNode current center of graph
     * @returns edges that were created
     */
    public update(width: number, height: number, headNode: GraphNode) {
        this.radiusBase = Math.min(width, height) / 2.5;
        this.distanceBase = Math.min(width, height) / 1.25;
        this.lastComputedEdges = [];
        // this makes it so you don't have to reset graph every time
        this.alternatingTrue = !headNode.wasVisited;
        headNode.setPartOfPath(true);
        this.update_Recursive(headNode, width/2, height/2, 0);
    }

    public getUpdatedEdges(): Array<[GraphNode, GraphNode]> {
        return this.lastComputedEdges === undefined ? [] : this.lastComputedEdges;
    }
}


