import { Page } from "pages/Pages"
import GraphNode from "./GraphNode";


export default class PageNode extends GraphNode {
    private myPage: Page;
    private connectedPagedNodes: Array<PageNode>;

    public addNode(node: PageNode, relativePlacement: number):void {
        super.addNode(node, relativePlacement);
        this.connectedPagedNodes.push(node);
    }

    public forEachNode(transform: (node: PageNode, radian: number) => void) {
        this.connectedPagedNodes.forEach((node, index) => { transform(node, this.relativePlacement[index]) });
    }

    public constructor(depthOriginal: number, baseRadian: number, page: Page) {
        super(depthOriginal, baseRadian);
        this.connectedPagedNodes = [];
        this.myPage = page;
    }

    public getPage(): Page {
        return this.myPage;
    }
    
}