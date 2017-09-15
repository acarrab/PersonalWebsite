import React from "react";

export class Page {
    static homePage: string;
    public name: string = "";
    public route: string = "";
    public connectionNames: Array<string> = [];
    public index: number;

    public constructor(name: string, route: string, connectionNames: Array<string>, index: number) {
        this.name = name;
        this.route = route;
        this.connectionNames = connectionNames;
        this.index = index;
    }
}


// use "p" to avoid later errors
class p {
    static Home = "Home";
    static About = "About";
    static Contact = "Contact";
}
let index = 0;

Page.homePage = p.Home;

export var pages: Array<Page> = [
    new Page(p.Home, "/", [p.About, p.Contact], index++),
    new Page(p.About, "/about", [p.Home], index++),
    new Page(p.Contact, "/contact", [p.Home], index++)
];

function indexOfName(pgs: Array<Page>, name: string): number {
    let results = pgs.filter((page) => (page.name === name));
    return results.length > 0 ? pgs.indexOf(results[0]) : -1;
}

function ValidatePagesConnections(pgs: Array<Page>, canFix: boolean = false) {
    let wasVague = false;
    for (let i = 0; i < pgs.length; i++) {
        pgs[i].connectionNames.forEach(pageName => {
            let pageIndex = indexOfName(pgs, pageName);

            if (pageIndex === -1 || (!canFix && pgs[pageIndex].connectionNames.indexOf(pgs[i].name) === -1)) {
                console.error("One way connection from " + pgs[i].name + " to " + (pageIndex === -1 ? "?" : pageName));
                wasVague = true;
            } else if (pgs[pageIndex].connectionNames.indexOf(pgs[i].name) === -1) {
                pgs[pageIndex].connectionNames.push(pgs[i].name);
            }
        })
    }
    if (wasVague) {
        throw "Page Indexing for pages is vague. Connections name does not exist";
    }
}

ValidatePagesConnections(pages);
