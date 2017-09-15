import { GraphNode } from "./GraphNode";
import { pages, Page } from "pages/Pages"
import { Updateable } from "Process";

export const nodeOrientationBaseInRadians = 0;


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


export default class Graph {

    protected nodes: Array<PageNode>;

    protected createdNodes: { [name: string]: PageNode };

    // we ensure that the first element is the lastNode
    private generateNode(lastNode: PageNode, theta: number, depth: number, newNodeName: string): PageNode {
     
        let rotation = theta - Math.PI; // flip around
        let page = pages[indexOfName(pages, newNodeName)]; // should always exist
        let node = new PageNode(page, depth, rotation);
        this.createdNodes[newNodeName] = node;
        this.nodes.push(node);

        
        // makes these nicer to look at
        while (rotation > Math.PI * 2) {
            rotation  -= Math.PI * 2
        }
        while (rotation < 0) {
            rotation += Math.PI * 2
        }
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
        this.nodes = [];
        let homePage = pages[indexOfName(pages, Page.homePage)];
        let homeNode = new PageNode(homePage, 0, nodeOrientationBaseInRadians);
        this.createdNodes[Page.homePage] = homeNode;
        this.nodes.push(homeNode);


        homePage.connectionNames.forEach((pageName: string, index: number) => {
            let rotation = nodeOrientationBaseInRadians + 2 * Math.PI * index / homePage.connectionNames.length;
            let node = this.generateNode(homeNode, rotation, 1, pageName)
            this.createdNodes[pageName] = node;
            homeNode.addNode(node, rotation);
        })
    }
}


