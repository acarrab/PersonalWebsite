import Point from "./Point";

const positionTransitionTime = 500;//ms
const radiusTransitionTime = 500;//ms
const swellTransitionTime = 100;//ms



function partition(progress:number, start:number, end: number) {
    return progress * end + (1.0 - progress) * start;
}



class TransitionValue {
    private transitionTime: number;
    
    private valueOld: number;
    private valueNew: number;
    
    private transitionStart: number;
    

    private partition(progress:number, start:number, end: number): number {
        return progress * end + (1.0 - progress) * start;
    }
    
    public set(value:number):void {
        this.transitionStart = Date.now();
        this.valueOld = this.valueNew;
        this.valueNew = value;
    }
    public get():number {
        let timeInMs:number = Date.now();
        if (this.transitionStart + this.transitionTime < timeInMs) {
            // We are done with transition
            return this.valueNew;
        }
        let progress:number = (timeInMs - this.transitionStart) / this.transitionTime;
        return progress * this.valueNew + (1.0 - progress) * this.valueOld;
    }
    public constructor(transitionTime:number) {
        this.transitionTime = transitionTime;
    }
}

export default class Node {
    
    private x: TransitionValue = new TransitionValue(positionTransitionTime);
    private y: TransitionValue = new TransitionValue(positionTransitionTime);
    private radius: TransitionValue = new TransitionValue(radiusTransitionTime);
    private swell: TransitionValue = new TransitionValue(swellTransitionTime);
    
    public getPosition():Point {
        return new Point(this.x.get(), this.y.get());
    }

    public getRadius():number {
        return this.radius.get() * this.swell.get();
    }

}



function NODE() {
    function MODEL() {
        this.nodes = [];
        this.head = null;
        this.toDraw = [];
        this.focus = null;
    };
    var model = new MODEL();
    this.view = null;
    this.controller = null;

    function CONTROLLER() {
        var first = true;
        var maxRadius = Math.min(width, height) * 1.4 / 10;
        var e = 1.22; //scalar for edge size;
        var powScale = 1.15;

        this.fixMaxRadius = function (x) {
            maxRadius = Math.min(width, height) * 1.4 / 10;
        };
        function getRadius(depth) {
            return maxRadius / Math.pow(1.6, depth);
        }
        function setFocusOn(n) {
            var t = '/~acarrab/?node=' + n.text.replace(" ", "%20");
            window.history.pushState("", "", t);
            console.log(t);
            pullPage(n.link);
            model.head = n;
            var i, j;
            for (i = 0; i < model.nodes.length; i++) {
                model.nodes[i].depth = -1;
            }
            var queue = [n];
            n.depth = 0;
            var maxDepth = 0;
            while (queue.length) {
                var c = queue[0];
                queue.splice(0, 1);
                for (i = 0; i < c.connected.length; i++) {
                    if (c.connected[i].depth < 0) {
                        c.connected[i].depth = c.depth + 1;
                        maxDepth = Math.max(maxDepth, c.connected[i].depth);
                        queue.push(c.connected[i]);
                    }
                }
            }
            n.setPosRad([width / 2, height / 2, getRadius(n.depth)]);
            if (first) {
                first = false;
                setPositionsBelowFirst(n);
            } else {
                setPositionsBelow(n);
            }
        }
        this.setFocusOnIndex = function (index) {
            setFocusOn(model.nodes[index]);
        };
        function computeBackPath(n) {
            n.partOfPath = true;
            if (n.originalDepth == 0) return;
            for (var i = 0; i < n.connected.length; i++) {
                var o = n.connected[i];
                if (o.originalDepth < n.originalDepth) {
                    computeBackPath(o);
                    return;
                }
            }
        }
        this.setBackPath = function () {
            for (var i = 0; i < model.nodes.length; i++) {
                model.nodes[i].partOfPath = false;
                computeBackPath(model.focus);
            }
        };
        this.clearBackPath = function () {
            model.focus = model.head;
            this.setBackPath();
        };
        this.clickEvent = function (event) {
            var pos = getMousePos(event);

            for (var i = 0; i < model.nodes.length; i++) {
                var pr = model.nodes[i].getPosRad();
                if (dist(pr, pos) < pr[2]) {
                    this.setFocusOnIndex(i);
                    return;
                }
            }

            var p2 = model.head.getPosRad();
            var theta = Math.atan2(pos[1] - p2[1], pos[0] - p2[0]);
            var minRadDist = 1000;
            var closestToCursor = 0;
            for (var n = 0; n < model.head.connRadians.length; n++) {
                var d = dist(
                    [Math.cos(model.head.connRadians[n]), Math.sin(model.head.connRadians[n])],
                    [Math.cos(theta), Math.sin(theta)]);
                if (minRadDist > d) {
                    minRadDist = d;
                    closestToCursor = n;
                }
            }
            this.setFocusOnIndex(model.head.connected[closestToCursor].index);
        };
        this.mouseReact = function (event) {
            var pos = getMousePos(event);
            lastMovement = getSec();
            var isHitting = false;
            for (var i = 0; i < model.nodes.length; i++) {
                var pr = model.nodes[i].getPosRad();
                var pr2 = model.nodes[i].getPosRad();
                if (dist(pr, pos) < pr[2]) {
                    model.nodes[i].addSwell(1.2);
                    model.focus = model.nodes[i];
                    isHitting = true;
                } else {
                    model.nodes[i].addSwell(1);
                }
            }
            if (!isHitting) {
                //if we may be about to go out of bounds
                if (pos[0] < wallBound.low + 20 || wallBound.right - 20 < pos[0] ||
                    pos[1] < wallBound.low + 20 || wallBound.top - 20 < pos[1]) {
                    model.focus = model.head;
                } else {
                    var p2 = model.head.getPosRad();
                    var theta = Math.atan2(pos[1] - p2[1], pos[0] - p2[0]);
                    var minRadDist = 1000;
                    var closestToCursor = 0;
                    for (var n = 0; n < model.head.connRadians.length; n++) {
                        var d = dist(
                            [Math.cos(model.head.connRadians[n]), Math.sin(model.head.connRadians[n])],
                            [Math.cos(theta), Math.sin(theta)]);
                        if (minRadDist > d) {
                            minRadDist = d;
                            closestToCursor = n;
                        }
                    }
                    model.head.connected[closestToCursor].addSwell(1.2);
                    model.focus = model.head.connected[closestToCursor];
                }
            }
            this.setBackPath();

        };
        function setPositionsBelowFirst(node, prev) {
            var i;
            var total = node.connected.length; //total surrounding nodes
            var spacing = 2 * Math.PI / total;
            var degree = 0;
            var pr = node.getNewPosRad();
            if (prev != undefined) {
                var prPrev = prev.getNewPosRad();
                degree = Math.atan2(prPrev[1] - pr[1], prPrev[0] - pr[0]);
            }
            degree += spacing;
            for (i = 0; i < total; i++) {
                if (node.connected[i] == prev) continue;
                node.connected[i].setPosRad([pr[0] + Math.cos(degree) * Math.pow(pr[2], powScale) * e,
                pr[1] + Math.sin(degree) * Math.pow(pr[2], powScale) * e,
                getRadius(node.connected[i].depth)]);
                setPositionsBelowFirst(node.connected[i], node);
                degree += spacing;
            }
        }
        function setPositionsBelow(node, prev) {
            var pr = node.getNewPosRad();
            for (var i = 0; i < node.connected.length; i++) {
                if (node.connected[i] == prev) continue;
                var degree = node.connRadians[i];
                node.connected[i].setPosRad([pr[0] + Math.cos(degree) * Math.pow(pr[2], powScale) * e,
                pr[1] + Math.sin(degree) * Math.pow(pr[2], powScale) * e,
                getRadius(node.connected[i].depth)]);
                setPositionsBelow(node.connected[i], node);
            }
        }

        //recursive tree generation
        function generate(T, nPrev) {
            var n = new Node();
            model.nodes.push(n);
            n.connected.push(nPrev);
            if (T.text != undefined) n.text = T.text;
            if (T.link != undefined) n.link = cacheData(T.link);
            for (var i = 0; T.T != undefined && i < T.T.length; i++) {
                n.connected.push(generate(T.T[i], n));
            }
            return n;
        }
        function loadResume() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    document.getElementById("resumeHolder").innerHTML = this.responseText;
                }
            };
            xhttp.open("GET", "rawResume.html", true);
            xhttp.send();
        }

        function putHTMLHere(htmlFile, where) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    //ADD declarations for mass changing html code here
                    var type, re = new RegExp("<img\s*src\s*=\s*\".*(TYPE)\.gif\"/*>");//this.responseText;
                    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                        type = "Static";
                    } else {
                        type = "Smaller";
                    }
                    var w = "<!--" + where + "-->";

                    var htmlCode = w + this.responseText.replace(new RegExp("(IMAGETYPE)", 'g'), type);
                    htmlCode = htmlCode.replace(new RegExp("<!--BUTTON_FORWARD{(.*)}-->", "g"), forwardButton);
                    htmlCode = htmlCode.replace(new RegExp("<!--BUTTON_BACKWARD{(.*)}-->", "g"), backButton);

                    document.getElementById(where).innerHTML = htmlCode;
                    //load resume if we need to
                    if (this.responseText.includes("resumeHolder")) {
                        loadResume();
                    }

                }
            };
            xhttp.open("GET", htmlFile, true);
            xhttp.send();
        }
        function cacheData(link) {
            var ID = link.match(/(.+)\.html/i)[1];
            var toHTML = '<div id="' + ID + '" style="display:none; height:0em !important;"></div>';
            //if this has not been created
            if (!document.getElementById(ID))
                document.getElementById("cachedInformation").innerHTML += toHTML;
            //if this has not been cached
            if (!document.getElementById(ID).innerHTML)
                putHTMLHere(link, ID);
            return ID;
        }
        this.generateNodesFromTree = function (inputTree) {
            model.head = 0;
            model.nodes = [new Node()];
            if (inputTree.text != undefined) model.nodes[0].text = inputTree.text;
            if (inputTree.link != undefined) model.nodes[0].link = cacheData(inputTree.link);

            model.nodes.push(model.nodes[0]);
            var i, j;
            for (i = 0; inputTree.T != undefined && i < inputTree.T.length; i++) {
                model.nodes[0].connected.push(generate(inputTree.T[i], model.nodes[0]));
            }
            for (i = 0; i < model.nodes.length; i++) {
                model.nodes[i].index = i;
            }
            setFocusOn(model.nodes[0]);
            for (i = 0; i < model.nodes.length; i++) {
                model.nodes[i].originalDepth = model.nodes[i].depth;
                //determining orginal degrees of placement to preserve graph structure
                var prn = model.nodes[i].getNewPosRad();
                for (j = 0; j < model.nodes[i].connected.length; j++) {
                    var pro = model.nodes[i].connected[j].getNewPosRad();
                    model.nodes[i].connRadians.push(Math.atan2(pro[1] - prn[1], pro[0] - prn[0]));
                }
            }
        };
        this.generateNodes = function (inputNodes, focusOnIndex) {
            if (focusOnIndex == undefined) focusOnIndex = 0;
            model.nodes = [];
            model.head = focusOnIndex ? focusOnIndex : 0;
            if (inputNodes == undefined || inputNodes.length == 0) return;
            var i, j, radiusMax = Math.min(width, height) / 10.0;
            for (i = 0; i < inputNodes.length; i++) {
                var n = new Node();
                n.connected = inputNodes[i][0];
                if (inputNodes[i][1]) n.text = inputNodes[i][1];
                if (inputNodes[i][2]) n.link = inputNodes[i][2];
                model.nodes.push(n);
                n.index = i;
            }
            //making sure everything is linked in both ways for quick changing of focus
            for (i = 0; i < model.nodes.length; i++) {
                for (j = 0; j < model.nodes[i].connected.length; j++) {
                    if ($.inArray(i, model.nodes[model.nodes[i].connected[j]].connected) == -1) {
                        model.nodes[model.nodes[i].connected[j]].connected.push(i);
                    }
                }
            }
            for (i = 0; i < model.nodes.length; i++) {
                for (j = 0; j < model.nodes[i].connected.length; j++) {
                    //converting index to node
                    model.nodes[i].connected[j] = model.nodes[model.nodes[i].connected[j]];
                }
            }
            setFocusOn(model.nodes[focusOnIndex]);
            for (i = 0; i < model.nodes.length; i++) {
                model.nodes[i].originalDepth = model.nodes[i].depth;
                var prn = model.nodes[i].getNewPosRad();
                for (j = 0; j < model.nodes[i].connected.length; j++) {
                    var pro = model.nodes[i].connected[j].getNewPosRad();
                    model.nodes[i].connRadians.push(Math.atan2(pro[1] - prn[1], pro[0] - prn[0]));
                }
            }
        };
    };
    this.controller = new CONTROLLER();
    this.fix = function (scalarW, scalarH) {
        this.controller.fixMaxRadius();
        this.controller.setFocusOnIndex(model.head.index);
        for (var i = 0; i < model.nodes.length; i++) {
            model.nodes[i].finishTransition();
        }

    };
    function VIEW() {
        this.getBorderColors = function () {
            return [borderColor, backColor];
        };
        this.setBorderColors = function (border, back) {
            borderColor = border;
            backColor = back;
        };
        function drawEdge(n, o) {
            //drawing to other node
            var prn = n.getPosRad();
            var pro = o.getPosRad();
            var uv = [pro[0] - prn[0], pro[1] - prn[1]];
            var scalar = Math.sqrt(uv[0] * uv[0] + uv[1] * uv[1]);
            uv[0] /= scalar;
            uv[1] /= scalar;
            ctx.beginPath();
            ctx.moveTo(prn[0] + uv[0] * prn[2], prn[1] + uv[1] * prn[2]);
            ctx.lineTo(pro[0] - uv[0] * pro[2], pro[1] - uv[1] * pro[2]);
            //draw red if drawing to parent and white otherwise
            if (n.partOfPath && o.partOfPath) { //we are drawing to a parent
                ctx.strokeStyle = backColor;
            } else {
                ctx.strokeStyle = borderColor;
            }
            ctx.lineWidth = n.getPosRad()[2] / Math.pow(1.2, n.depth + 15);
            ctx.stroke();
        };
        function drawText(n) {
            var pr = n.getPosRad();
            ctx.font = Math.floor(pr[2] / 2.6) + "px Arial";
            ctx.fillStyle = "black";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            var splitText = "";
            if (n.text.length > 10 && n.text.search(" ") != -1) {
                splitText = n.text.split(" ");
                for (var i = 0; i < splitText.length; i++) {
                    ctx.fillText(splitText[i], pr[0],
                        pr[1] - pr[2] * .8 +
                        (pr[2]) * (i + 1) / splitText.length);
                }
            } else if (n.text.length > 10 && n.text.search("-") != -1) {
                splitText = n.text.split("-");
                splitText[0] += "-"
                for (var i = 0; i < splitText.length; i++) {
                    ctx.fillText(splitText[i], pr[0],
                        pr[1] - pr[2] * .8 +
                        (pr[2]) * (i + 1) / splitText.length);
                }
            } else {
                ctx.fillText(n.text, pr[0], pr[1]);
            }
        }
        //flipping the order of recursion so that nodes are drawn in reverse and
        //overlapping text makes sense
        function drawFromNode(n, prev) {
            if (n.visited) return;
            n.visited = true;

            //draw edges first
            for (var i = 0; i < n.connected.length; i++) {
                if (n.connected[i].visited) continue;
                var o = n.connected[i];
                drawEdge(n, o);
            }

            //draw my neighbors
            for (var i = 0; i < n.connected.length; i++) {
                if (n.connected[i].visited) continue;
                var o = n.connected[i];
                drawFromNode(o, n);
            }

            //then draw myself
            var pr = n.getPosRad();
            ctx.beginPath();
            ctx.arc(pr[0], pr[1], pr[2], 2 * Math.PI, false);
            ctx.fillStyle = "linen";

            ctx.shadowBlur = 20;
            ctx.shadowOffsetX = 10;
            ctx.shadowOffsetY = 10;
            ctx.fill();
            ctx.lineWidth = n.getPosRad()[2] / Math.pow(1.2, n.depth + 15);
            if (n.partOfPath) {
                ctx.strokeStyle = backColor;
            } else {
                ctx.strokeStyle = borderColor;
            }
            ctx.stroke();
            //only draw text if there is text to draw
            if (n.text) {
                drawText(n, pr[2]);
            }
        }
        function getDrawToPair() {
            var l = model.head.connected.length;
            if (l == 1) return [0, 0];
            for (var i = 0; i < l; i++) {
                if (model.head.connected[i] == model.focus) {
                    var d = model.head.connRadians[i];
                    var rads = Math.PI / l;
                    return [d - rads, d + rads];
                }
            }
            return [0, 0];
        }

        function drawSegment(r1, r2, color, isFocus) {
            var p = model.head.getPosRadBase();
            p[2] *= 3;

            //getting the gradient set up
            var grd = null;
            if (isFocus) {
                var t = model.focus.getPosRadBase();
                var theta = Math.atan2(t[1] - p[1], t[0] - p[0]);
                var shiftScale = .5;
                grd = ctx.createRadialGradient(t[0] + Math.cos(theta) * t[2] * shiftScale, t[1] + Math.sin(theta) * t[2] * shiftScale, 0,
                    p[0], p[1], p[2]);
            } else {
                grd = ctx.createRadialGradient(p[0], p[1], 0,
                    p[0], p[1], p[2]);
            }
            grd.addColorStop(0, color);
            grd.addColorStop(1, canvasColor);
            ctx.fillStyle = grd;

            //start the drawing
            ctx.moveTo(p[0], p[1]);
            ctx.beginPath();
            ctx.lineTo(p[0] + Math.cos(r1) * p[2], p[1] + Math.sin(r1) * p[2]);
            ctx.arc(p[0], p[1], p[2], r1, r2);
            ctx.lineTo(p[0], p[1]);
            ctx.fill();
        }

        this.drawSelectionWheel = function () {
            //first draw proper gradients
            var l = model.head.connected.length;
            if (model.head == model.focus) {
                //drawing only off color
                drawSegment(0, Math.PI * 2, wheelHighlights.nonFocusColor, false);
            } else if (l == 1) {
                drawSegment(0, Math.PI * 2, wheelHighlights.focusColor, true);
            } else {
                //draw directing at focus
                var r = getDrawToPair();
                drawSegment(r[0], r[1], wheelHighlights.focusColor, true);
                //non focus to color rest grey
                drawSegment(r[1], r[0], wheelHighlights.nonFocusColor, false);
            }
            //we are not drawing lines if only one thing
            if (l != 1) {
                //do draw
                var p = model.head.getPosRadBase();
                p[2] *= 3.2;
                var b = model.head.getPosRad()[2];
                //getting the gradient set up
                var grd = ctx.createRadialGradient(p[0], p[1], b,
                    p[0], p[1], p[2]);
                grd.addColorStop(0, wheelHighlights.lineColor);
                grd.addColorStop(1, canvasColor);
                //drawing the lines
                ctx.beginPath();
                ctx.strokeStyle = grd;
                ctx.lineWidth = "2";
                var connRads = model.head.connRadians.slice(0);
                var base = Math.PI / l;
                for (var i = 0; i < l; i++) {
                    var r = connRads[i] + base;
                    ctx.moveTo(p[0], p[1]);
                    ctx.lineTo(p[0] + Math.cos(r) * p[2],
                        p[1] + Math.sin(r) * p[2]);
                    ctx.stroke();
                }
            }
        };
        this.draw = function () {
            for (var i = 0; i < model.nodes.length; i++) {
                model.nodes[i].visited = false;
            }
            drawFromNode(model.head);
        };
        this.getIndexWith = function (text) {
            text = text.replace("%20", " ");
            for (var i = 0; i < model.nodes.length; i++) {
                if (model.nodes[i].text != undefined &&
                    model.nodes[i].text == text) return i;
            }
            return 0;
        };
        this.getCurrentIndex = function () {
            return model.head.index;
        };
    }
    this.view = new VIEW();
}