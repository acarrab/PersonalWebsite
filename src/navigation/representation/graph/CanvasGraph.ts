import PageGraph from "./PageGraph";
import CanvasNode from "../node/CanvasNode";
import GraphNode from "../node/GraphNode";
import { Updateable, drawAll } from "../../../Process";



export default class CanvasGraph extends PageGraph implements Updateable {
    
    private canvasNodes: Array<CanvasNode>;
    private edges: Array<[GraphNode, GraphNode]>;
    constructor() {
        super();
        let nodeList = this.getNodeList();
        this.canvasNodes = [];
        nodeList.forEach(node => {
            this.canvasNodes.push(new CanvasNode(node));
        })
        console.log(nodeList);
    }
    public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D):boolean {
        if (this.edges != undefined) {
            this.edges.forEach(edge => {
                let a = edge[0].getPosition();
                let b = edge[1].getPosition();
                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);
                if (edge[0].isPartOfPath() && edge[1].isPartOfPath()) {
                    ctx.strokeStyle = "orange";
                };
                ctx.stroke();
            })
        }
        return drawAll(this.canvasNodes, canvas, ctx);
    }
    
    update(width: number, height: number):void {
        super.update(width, height);
        this.edges = super.getUpdatedEdges();
    }
}