import GraphNode from "./GraphNode";

const jsonString = `
{
    "Home" : {
        "route": "/"
    },
    "About" : {
        "route": "/about"
    },
    "Contact" : {
        "route": "/contact"
    }
}
`

export default class Graph {
    
    private nodes: Array<GraphNode> = [];

    add(): void {
        
    }
}