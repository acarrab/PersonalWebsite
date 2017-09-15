import FixedGraph from "./FixedGraph";
import { Updateable } from "Process";

export class CanvasGraph extends FixedGraph implements Updateable {
    
   

    public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D):boolean {
        var wasUpdate = false;
        this.nodes.forEach(node => { if (node.draw(canvas, ctx)) { wasUpdate = true; } });
        return wasUpdate;
    }
    
    private headNodeName:string;
    
    public draw(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D):boolean {
        var wasUpdate = false;
        this.nodes.forEach(node => { if (node.draw(canvas, ctx)) { wasUpdate = true; } });
        return wasUpdate;
    }

    private visited: { [nodeName: string] : boolean };
    
    private update_Recursive(node: PageNode, x:number, y:number, depth:number) {
        // We visit every node at least once and set it's distance if possible.
        if (this.visited[node.page.name] === undefined) {
            this.visited[node.page.name] = true;
            node.setDepth(depth);
            node.setRadius(radiusTransformer.transform(this.radiusBase, depth));
            node.setPosition(x, y);
            let distance = distanceTransformer.transform(this.distanceBase, depth);
            //nodes are guaranteed, by us before, to have parent as first node, so we can ignore that here
            node.forEachNode((other: PageNode, radians: number) => {
                this.update_Recursive(other, x + Math.cos(radians) * distance, y + Math.sin(radians) * distance, depth + 1);
            });
        }
    }
    
    public update(width: number, height: number) {
        let node = this.createdNodes[this.headNodeName]
        if (node === undefined) {
            throw new Error("Specificied head node does not exist");
        } else {
            this.visited = {};
            this.update_Recursive(node, width/2, height/2, 0);
        }
    }

    public change(headNodeName: string) {
        this.headNodeName = headNodeName;
        this.update();
    }
    public constructor(canvas:HTMLCanvasElement, width:number, height:number) {
        super();
        this.width = width;
        this.height = height;
        /// 3.0 is arbitrary to make radius smaller than distance
        this.radiusBase = 4 * Math.min(width, height) / (3.0 * guaranteedDepth);
        this.distanceBase = 4 * Math.min(width, height) / (2.0 * guaranteedDepth);
    }
}