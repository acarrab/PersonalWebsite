import PageNode from "./PageNode";
import { Updateable } from "Process";
import { Point } from "./Node";

/**
 * Drawable graph node that maintains whether it is actually updating 
 */
export default class CanvasNode {
    private positionLastRead: Point;
    private radiiLastRead: number;

    private connectedCanvasNodes: Array<CanvasNode>;

    private internalNode: PageNode;

    public constructor(node: PageNode) {
        this.internalNode = node;
    }

    draw(cvs: HTMLCanvasElement, ctx: CanvasRenderingContext2D): boolean {
        let wasUpdate = false;

        let radius = this.internalNode.getRadius();
        let position = this.internalNode.getPosition();

        if (this.radiiLastRead === undefined || radius !== this.radiiLastRead) {
            wasUpdate = true;
            this.radiiLastRead = radius;
        }

        if (this.positionLastRead === undefined) {
            wasUpdate = true;
            this.positionLastRead = new Point(position.x, position.y);
        }
        else if (position.x !== this.positionLastRead.x || position.y !== this.positionLastRead.y) {
            wasUpdate = true;
            this.positionLastRead.x = position.x;
            this.positionLastRead.y = position.y;
        }


        ctx.beginPath();

        ctx.arc(position.x, position.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = "yellow";
        //ctx.fill();
        ctx.lineWidth = 5;
        if (this.internalNode.isPartOfPath()) {
            ctx.strokeStyle = "orange";
        } else {
            ctx.strokeStyle = "blue";
        }
        ctx.stroke();
        return wasUpdate;
    }
}