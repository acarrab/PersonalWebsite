import Graph from "./Graph";
import Pages from "../../../pages/Pages";
import PageNode from "../node/PageNode";
import GraphNode from "../node/GraphNode";

const nodeOrientationBaseInRadians = 0;

export default class PagedGraph extends Graph {

    private pageNodes: { [pageName: string] : PageNode}

    protected getNodeList() {
        let nodeList = [];
        for (let pageName in this.pageNodes) {
            nodeList.push(this.pageNodes[pageName]);
        }
        return nodeList;
    }

    private pages: Pages;

    // we ensure that the first element is the lastNode
    private generateNodes(nodeName: string, rotationBase: number, depth: number, lastNode?:PageNode): PageNode {
        let pageIndex = this.pages.indexOf(nodeName);
        if (pageIndex === -1) {
            throw new Error("Specified page '" + nodeName + "' does not exist");
        }
        let page = this.pages.get(pageIndex);
        let node = new PageNode(depth, rotationBase, page);
        this.pageNodes[nodeName] = node;

        /*
        let spacing = "> ";
        for(let i = 0; i < depth; i++) {
            spacing += "> ";
        }
        console.log(spacing + nodeName);
        console.log(this.pages)
        */
        let index = 0;
        
        // this has to be first node
        if (lastNode !== undefined) {
            node.addNode(lastNode, rotationBase);
            index++;
        }
        page.connectionNames.forEach((pageName) => {
            if (lastNode === undefined || pageName !== lastNode.getPage().name) {
                // get how they are rotated around us
                let rotation = 2.0 * Math.PI * index / page.connectionNames.length;
                // get how we are rotated around them
                let theirInverseRotation = rotation < Math.PI ? rotation + Math.PI : rotation - Math.PI;
                node.addNode(this.generateNodes(pageName, theirInverseRotation, depth + 1, node), rotation);
                index++;
            }
        });
        
        // return created node
        return node;
    }

    public constructor() {
        super();
        this.pageNodes = {};
        this.pages = Pages.getInstance();
        
        let homePageIndex = this.pages.indexOf(this.pages.getHomePage());
        if (homePageIndex === -1) {
            throw new Error("Home page does not exist in pages");
        }
        this.generateNodes(this.pages.getHomePage(), nodeOrientationBaseInRadians, 0);
    }

    public update(width: number, height: number) {
        super.update(width, height, this.pageNodes[this.pages.getCurrentPage()]);
    }

    public getUpdatedEdges():Array<[GraphNode, GraphNode]> {
        return super.getUpdatedEdges();
    }
}