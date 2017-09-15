import Graph from "./Graph";
import GraphNode from "../node/GraphNode";

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

const guaranteedDepth = 5;
const radiusTransformer = new GeometricSeriesCap(.9, guaranteedDepth);
const distanceTransformer = new GeometricSeriesCap(.7, guaranteedDepth);


class AugmentedNode {
    public node:GraphNode;
    public wasVisited: boolean;
    constructor(node:GraphNode) {
        this.node = node;
    }
    
}


export default class FixedGraph extends Graph {
    private radiusBase:number;
    private distanceBase:number;
    
    private headNodeName:string;
    
    private update_Recursive(nodeWrapper: AugmentedNode, x:number, y:number, depth:number) {
        // We visit every node at least once and set it's distance if possible.
        if (!nodeWrapper.wasVisited) {
            nodeWrapper.wasVisited = true;
            let node = nodeWrapper.node;
            node.setDepth(depth);
            node.setRadius(radiusTransformer.transform(this.radiusBase, depth));
            node.setPosition(x, y);
            let distance = distanceTransformer.transform(this.distanceBase, depth);
            //nodes are guaranteed, by us before, to have parent as first node, so we can ignore that here
            node.forEachNode((other: GraphNode, radians: number) => {
                this.update_Recursive(new AugmentedNode(other), x + Math.cos(radians) * distance, y + Math.sin(radians) * distance, depth + 1);
            });
        }
    }
    
    public update(width: number, height: number) {
        let node = this.createdNodes[this.headNodeName]
        if (node === undefined) {
            throw new Error("Specificied head node does not exist");
        } else {
            this.update_Recursive(new AugmentedNode(node), width/2, height/2, 0);
        }
    }
}