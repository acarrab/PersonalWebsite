import Node from "./Node";
/**
 * Extension of node that is meant to have features that help represent a graph
 */
export default class GraphNode extends Node {

    public wasVisited:boolean = false;
    
    private connectedNodes: Array<Node>;
    private edges: Array<[number, number]>;
    protected relativePlacement: Array<number>; // in radians

    public addNode(node: Node, relativePlacement: number): void {
        this.connectedNodes.push(node);
        this.relativePlacement.push(relativePlacement);
    }

    public forEachNode(transform: (node: Node, radian: number) => void) {
        this.connectedNodes.forEach((node, index) => { transform(node, this.relativePlacement[index]) });
    }

    private baseRadian: number;

    public constructor(depthOriginal: number, baseRadian: number) {
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
    public setDepth(depth: number) {
        if (this.depthOriginal === null) {
            this.depthOriginal = depth;
        }
        this.depthCurrent = depth;
    }

    public isInversion(other:GraphNode):boolean {
        if ((this.depthOriginal < other.depthOriginal) != (this.depthCurrent < other.depthCurrent)) {
            return true;
        }
        return false;
    }

    private partOfPath: boolean = false;

    public isPartOfPath(): boolean {
        return this.partOfPath;
    }
    public setPartOfPath(state: boolean) {
        this.partOfPath = state;
    }
}