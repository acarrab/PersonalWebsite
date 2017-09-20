import PageGraph from "./PageGraph";
import CanvasNode from "../node/CanvasNode";
import GraphNode from "../node/GraphNode";
import { Updateable, drawAll } from "../../../Process";
import Artist from "../../Artist";



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
    }
    public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D):boolean {
        if (this.edges != undefined) {
            this.edges.forEach(edge => {
                let a = edge[0].getPosition();
                let b = edge[1].getPosition();

                let ra = edge[0].getRadius();
                let rb = edge[1].getRadius();

                let theta = Math.atan2(b.y - a.y, b.x - a.x);

                a.x += ra * Math.cos(theta);
                a.y += ra * Math.sin(theta);

                b.x -= rb * Math.cos(theta);
                b.y -= rb * Math.sin(theta);


                ctx.beginPath();
                ctx.moveTo(a.x, a.y);
                ctx.lineTo(b.x, b.y);

                if (edge[0].isPartOfPath() && edge[1].isPartOfPath()) {
                    ctx.strokeStyle = Artist.getFadingGradient(canvas, ctx, "orange");
                } else {
                    ctx.strokeStyle = Artist.getFadingGradient(canvas, ctx, "blue");
                }
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