import { GraphNode, nodeOrientationBaseInRadians } from "./GraphNode";
import { pages, Page } from "../Pages";
import { CanvasDrawable } from "./Artist";


class NodeData {
    public name: string;
    public route: string;
    public connectedNodeNames: Array<string>;

    public constructor(name: string, route: string, connectedNodeNames: Array<string>) {
        this.name = name.slice();
        this.route = route.slice();
        this.connectedNodeNames = [];
        for (var value in connectedNodeNames) {
            this.connectedNodeNames.push(value.slice());
        }
    }
}


function indexOfName(pgs: Array<Page>, name: string): number {
    let results = pgs.filter((page) => (page.name === name));
    return results.length > 0 ? pgs.indexOf(results[0]) : -1;
}

class PageNode extends GraphNode {

    public page: Page;

    public constructor(page: Page, depthOriginal: number, baseRadians: number) {
        super(depthOriginal, baseRadians);
        this.page = page;
    }
}


export class Graph {

    protected nodes: Array<PageNode> = [];

    protected createdNodes: { [name: string]: PageNode };

    // we ensure that the first element is the lastNode
    private generateNode(lastNode: PageNode, theta: number, depth: number, newNodeName: string): PageNode {
        let rotation = theta - Math.PI; // flip around
        let page = pages[indexOfName(pages, newNodeName)]; // should always exist
        let node = new PageNode(page, depth, rotation);

        // add our parent
        node.addNode(lastNode, rotation);

        // add rest
        let trueOrdering = 1;
        page.connectionNames.forEach((pageName) => {
            // it should contain parent page by specifications so
            if (pageName === lastNode.page.name) { return; }
            let theirRotation = rotation + 2 * Math.PI * trueOrdering / page.connectionNames.length;
            trueOrdering++;
            node.addNode(this.generateNode(node, theirRotation, depth + 1, pageName), theirRotation);
        });
        
        // return created node
        return node;
    }

    public constructor() {

        this.createdNodes = {};
        let homePage = pages[indexOfName(pages, Page.homePage)];
        let homeNode = new PageNode(homePage, 0, nodeOrientationBaseInRadians);
        this.createdNodes[Page.homePage] = homeNode;


        homePage.connectionNames.forEach((pageName: string, index: number) => {
            let rotation = nodeOrientationBaseInRadians + 2 * Math.PI * index / homePage.connectionNames.length;
            homeNode.addNode(this.generateNode(homeNode, rotation, 1, pageName), rotation);
        })
    }
}


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


export class CanvasGraph extends Graph implements CanvasDrawable {
    
    private width:number;
    private height:number;
    private radiusBase:number;
    private distanceBase:number;
    
    
    public draw(canvas: HTMLCanvasElement, ctx:CanvasRenderingContext2D):void {
        this.nodes.forEach(node => (node.draw(canvas, ctx)));
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
    
    public update(headNodeName: string) {
        let node = this.createdNodes[headNodeName]
        if (node === undefined) {
            throw new Error("Specificied head node does not exist");
        } else {
            this.visited = {};
            this.update_Recursive(node, this.width/2, this.height/2, 0);
        }
    }
    public constructor(canvas:HTMLCanvasElement, width:number, height:number) {
        super();
        this.width = width;
        this.height = height;
        /// 3.0 is arbitrary to make radius smaller than distance
        this.radiusBase = Math.min(width, height) / (3.0 * guaranteedDepth);
        this.distanceBase = Math.min(width, height) / (2.0 * guaranteedDepth);
    }
}