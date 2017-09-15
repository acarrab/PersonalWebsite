/*
This is some code I wrote when I did not write javascript well and wrote it 
without modules and other things that make code nice and maintainable, so I 
use some of the logic for writing out my code, but most of it is unnecessary to 
implement, because I want something more minimal now. 

Also not doing clicks at the moment. 
*/

"use strict";
var fps = 25;
var still = null;
var size = 0;
var reduceMotion = false;

var borderColor = "#ebd9c7";"linen";"#38ACEC";
var backColor = "#FF533D";"orange";"#a338ec";//"#F62217";
var speckColor = "linen";
var canvasColor = "#0F1626";

var wheelHighlights = new function() {
    this.lineColor = "#FF533D";
    this.nonFocusColor = "#101010";
    this.focusColor = "#6d6d72";
};

function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}
if (isMobile()) {
    reduceMotion = true;
}

var infoControl = new function() {
    var down = false;
    var bottom = 0;
    var pos = 0;
    var stepSize = 200;
    var waitTime = 30;
    var betweenTransition = 200;
    var newPage = null;
    this.running = false;
    var restart = false;

    function getDocTag() {
        var info = document.getElementById('webInfoLocation');
        if (info.innerHTML == null || info.innerHTML.length == 0) return null;
        var res = "";
        //<!--
        for (var i = 4; i < info.innerHTML.length; i++) {
            res += info.innerHTML.charAt(i);
            if (info.innerHTML.charAt(i + 1) == '-')
                return res;
        }
        return res.length ? res : null;
    };
    this.go = function() {
        if (reduceMotion) { return; }
        var info = document.getElementById('webInfoLocation');
        bottom = -$('.coverInfo').height();
        //fixes movement of the page
        if (down && newPage == getDocTag()) {
            down = false;
        }
        if (restart) {
            restart = false;
            bottom = -$('.coverInfo').height();
            pos = bottom;
            info.style.top = pos;
            info.style.visibility = "visible";
        }
        if (newPage != getDocTag()) {
            down = true;
        }
        if (down && pos > bottom) {
            pos = Math.max(bottom, pos - stepSize);
        }
        else if (!down && pos < 0) {
            pos = Math.min(0, pos + stepSize);
        }
        info.style.top = pos + "px";
        if (down && pos == bottom && getDocTag() != newPage) {
            info.style.visibility = "hidden";
            info.innerHTML = newPage ? document.getElementById(newPage).innerHTML : "";
            $("#navigation").css("min-height", $(document).height());
            down = false;
            restart = true;
            setTimeout( function() { infoControl.go(); }, betweenTransition);
        } else {
            setTimeout( function() { infoControl.go(); }, waitTime);
        }
    };
    this.changePage = function(pageName) {
        newPage = pageName == undefined ? null : pageName;
    };
};
function pullPage(pageName) {
    if (reduceMotion) {
        infoControl.running = false;
        document.getElementById('webInfoLocation').style.top = 0;
        document.getElementById('webInfoLocation').innerHTML =
            pageName ? document.getElementById(pageName).innerHTML : "";
        return;
    }
    if(!infoControl.running) {
        infoControl.running = true;
        infoControl.go();
    }
    infoControl.changePage(pageName);
}
var cvsCtrl = null; //canvas control object
//using an tree to traverse website.
function canvasModel() {
    var canvasName = "main";
    var mspf = 1000/fps;//miliseconds per frame
    var transitionSteps = { value: 256, shifts: 8 };
    var wallBound = null;
    var lastMovement = getSec() - 100;
    this.getLastMovement = function() {
        return lastMovement;
    };


    var width, height, canvasSettings, canvas, ctx;
    var prevWidth, prevHeight;
    this.fix = function() {
        var scalarW = width/prevWidth;
        var scalarH = height/prevHeight;
        wallBound.right = width - wallBound.low;
        wallBound.top = height - wallBound.low;

        if (this.node != undefined) {
            this.node.fix(scalarW, scalarH);
            cvsCtrl.getCanvas().addEventListener('click', function(event) {
                cvsCtrl.node.controller.clickEvent(event); }, false);
            cvsCtrl.getCanvas().addEventListener('mousemove', function(event) {
                cvsCtrl.node.controller.mouseReact(event); }, false);
        }
        if (this.speck != undefined) {
            this.speck.fix(scalarW, scalarH);
        }
    };
    //scale of resolution
    var scale = 2;
    this.resize = function() {
        if (this==undefined) return;
        prevWidth = width;
        prevHeight = height;
        width = Math.floor($("#contentHolder").width());
        height = Math.floor($("#topBar").height()*6);

        canvasSettings = "<canvas id=\"main\" width=\"" + width*scale+ "\" height=\"" + height*scale + "\" ";
        canvasSettings += "style=\"width: "+width+"px; height: "+ height+"px; background-color: "+canvasColor + ";\" ></canvas>";
        document.getElementById("canvasLocation").innerHTML = canvasSettings;
        canvas = document.getElementById("main");
        ctx = canvas.getContext("2d");
        canvas.getContext('2d').scale(scale, scale);

        this.fix();
    };
    wallBound = new function() { this.low = 10; };
    this.resize();
    prevWidth = 1;//------------------------------------------------------------------------------------------
    prevHeight = 1;
    this.getCanvas = function() { return canvas; };

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Helper Functions ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    function getMousePos(evt) {
        var rect = canvas.getBoundingClientRect();
        var scaleX = canvas.width / rect.width / scale;
        var scaleY = canvas.height / rect.height / scale;
        return [(evt.clientX - rect.left) * scaleX, (evt.clientY - rect.top) * scaleY];
    }
    //quick randomization getting
    var random = function() {
        var currD = 0;
        var currS = 0;
        var degrees = [];
        var scalars = [];
        for (var i = 0; i < 128; i++) {
            degrees.push(Math.random()*2*Math.PI);
            scalars.push(Math.random());
        }
        this.degree = function() {
            currD = (currD++)&127;
            return degrees[currD];
        };
        this.scalar = function() {
            currS = (currS++)&127;
            return scalars[currS];
        };
    };

    function dist(a,b) {
        return Math.sqrt((a[0] - b[0])*(a[0] - b[0]) + (a[1] - b[1])*(a[1] - b[1]));
    };
    function distSq(a,b) {
        return (a[0] - b[0])*(a[0] - b[0]) + (a[1] - b[1])*(a[1] - b[1]);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Node Object ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    var transitionTime = 500;//milisecond
    var swellTime = 100;

    function Node() {
        //x, y, r
        var p = [0,0, 2, 1];
        var oldP = [0,0, 2, 1];
        var saved = new Date().getTime();
        var saved2 = new Date().getTime();
        this.getPosRad = function() {
            if (p.length < 4) p.push(1);
            if (oldP.length < 4) oldP.push(1);
            var current = new Date().getTime();
            if (current > saved + transitionTime && current > saved2 + swellTime) {
                return [p[0], p[1], p[2]*p[3]];
            }
            var x = (current - saved) / transitionTime;
            var y = 1 - x;
            if (current > saved2 + swellTime) {
                return [p[0]*x + oldP[0]*y, p[1]*x + oldP[1]*y, (p[2]*x + oldP[2]*y)*p[3]];
            }
            var swell = p[3] * ((current-saved2)/swellTime) + oldP[3] * (1 - (current-saved2)/swellTime);
            if (current > saved + transitionTime) {
                return [p[0], p[1], p[2]*swell];
            }
            return [p[0]*x + oldP[0]*y, p[1]*x + oldP[1]*y, (p[2]*x + oldP[2]*y)*swell];

        };
        this.getPosRadBase = function() {
            var result = this.getPosRad();
            result[2] = p[2];
            return result;
        };
        function getCombo() {
            var current = new Date().getTime();
            if (current > saved + transitionTime && current > saved2 + swellTime) {
                return [p[0], p[1], p[2], p[3]];
            }
            var x = (current - saved) / transitionTime;
            var y = 1 - x;
            if (current > saved2 + swellTime) {
                return [p[0]*x + oldP[0]*y, p[1]*x + oldP[1]*y, p[2]*x + oldP[2]*y, p[3]];
            }
            var swell = p[3] * ((current-saved2)/swellTime) + oldP[3] * (1 - (current-saved2)/swellTime);
            if (current > saved + transitionTime) {
                return [p[0], p[1], p[2], swell];
            }
            return [p[0]*x + oldP[0]*y, p[1]*x + oldP[1]*y, (p[2]*x + oldP[2]*y), swell];
        }
        this.getNewPosRad = function() {
            return p;
        };
        this.finishTransition = function() {
            oldP = [p[0], p[1], p[2], p[3]];
        };
        this.addSwell = function(ratio) {
            oldP[3] = getCombo()[3];
            saved2 = new Date().getTime();
            p[3] = ratio;
        };
        this.setPosRad = function(newP) {
            var x = getCombo();
            x[3] = oldP[3];
            oldP = x;
            saved = new Date().getTime();
            p = newP;
        };
        this.connected = [];
        this.connRadians = [];
        this.depth = 0;
        this.originalDepth = 0;
        this.index = 0;
        this.partOfPath = false;
    };
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
            var maxRadius = Math.min(width, height)* 1.4/10;
            var e = 1.22; //scalar for edge size;
            var powScale = 1.15;

            this.fixMaxRadius = function(x) {
                maxRadius = Math.min(width, height)* 1.4/10;
            };
            function getRadius(depth) {
                return maxRadius / Math.pow(1.6, depth);
            }
            function setFocusOn(n) {
                var t = '/~acarrab/?node='+n.text.replace(" ", "%20");
                window.history.pushState("","",t);
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
                    queue.splice(0,1);
                    for (i = 0; i < c.connected.length; i++) {
                        if (c.connected[i].depth < 0) {
                            c.connected[i].depth = c.depth + 1;
                            maxDepth = Math.max(maxDepth, c.connected[i].depth);
                            queue.push(c.connected[i]);
                        }
                    }
                }
                n.setPosRad([width/2, height/2, getRadius(n.depth)]);
                if (first) {
                    first = false;
                    setPositionsBelowFirst(n);
                } else {
                    setPositionsBelow(n);
                }
            }
            this.setFocusOnIndex = function(index) {
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
            this.setBackPath = function() {
                for (var i = 0; i < model.nodes.length; i++) {
                    model.nodes[i].partOfPath = false;
                    computeBackPath(model.focus);
                }
            };
            this.clearBackPath = function() {
                model.focus = model.head;
                this.setBackPath();
            };
            this.clickEvent = function(event) {
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
                        [Math.cos(model.head.connRadians[n]),Math.sin(model.head.connRadians[n])],
                        [Math.cos(theta), Math.sin(theta)]);
                    if (minRadDist > d) {
                        minRadDist = d;
                        closestToCursor = n;
                    }
                }
                this.setFocusOnIndex(model.head.connected[closestToCursor].index);
            };
            this.mouseReact = function(event) {
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
                    if (pos[0] < wallBound.low + 20 || wallBound.right - 20 < pos[0]||
                        pos[1] < wallBound.low + 20 || wallBound.top  - 20 < pos[1]) {
                        model.focus = model.head;
                       } else {
                           var p2 = model.head.getPosRad();
                           var theta = Math.atan2(pos[1] - p2[1], pos[0] - p2[0]);
                           var minRadDist = 1000;
                           var closestToCursor = 0;
                           for (var n = 0; n < model.head.connRadians.length; n++) {
                               var d = dist(
                                   [Math.cos(model.head.connRadians[n]),Math.sin(model.head.connRadians[n])],
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
                var spacing = 2*Math.PI / total;
                var degree = 0;
                var pr = node.getNewPosRad();
                if (prev != undefined) {
                    var prPrev = prev.getNewPosRad();
                    degree = Math.atan2(prPrev[1] - pr[1], prPrev[0] - pr[0]);
                }
                degree += spacing;
                for (i = 0; i < total; i++) {
                    if (node.connected[i] == prev) continue;
                    node.connected[i].setPosRad([pr[0] + Math.cos(degree) * Math.pow(pr[2], powScale)*e,
                                                 pr[1] + Math.sin(degree) * Math.pow(pr[2], powScale)*e,
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
                    node.connected[i].setPosRad([pr[0] + Math.cos(degree) * Math.pow(pr[2], powScale)*e ,
                                                 pr[1] + Math.sin(degree) *Math.pow(pr[2], powScale)*e,
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
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("resumeHolder").innerHTML = this.responseText;
                    }
                };
                xhttp.open("GET", "rawResume.html", true);
                xhttp.send();
            }

            function forwardButton(str, p1, offset, s) {
                var html = "";
                html += "<table>";
                html += "  <tr>";
                html += "    <th class=\"buttonCol\">";
                html += "      <p3 style=\"font-size: 1.2em\">";
                html += p1;
                html += "      </p3>";
                html += "    </th>";
                html += "    <th>";
                html += "      <p3 class=\"material-icons\" style=\"font-size: 2em;\">";
                html += "        arrow_forward";
                html += "      </p3>";
                html += "    </th>";
                html += "  </tr>";
                html += "</table>";
                return html;
            }
            function backButton(str, p1, offset, s) {
                var html = "";
                html += "<table>";
                html += "  <tr>";
                html += "    <th>";
                html += "      <p3 class=\"material-icons\" style=\"font-size: 2em;\">";
                html += "        arrow_back";
                html += "      </p3>";
                html += "    </th>";
                html += "    <th class=\"buttonCol\">";
                html += "      <p3 style=\"font-size: 1.2em\">";
                html += p1;
                html += "      </p3>";
                html += "    </th>";
                html += "  </tr>";
                html += "</table>";
                return html;
            }

            function putHTMLHere(htmlFile, where) {
                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        //ADD declarations for mass changing html code here
                        var type, re = new RegExp("<img\s*src\s*=\s*\".*(TYPE)\.gif\"/*>");//this.responseText;
                        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
                            type = "Static";
                        } else {
                            type = "Smaller";
                        }
                        var w  = "<!--"+where+"-->";

                        var htmlCode = w + this.responseText.replace(new RegExp("(IMAGETYPE)", 'g'),type);
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
                var toHTML = '<div id="'+ ID+'" style="display:none; height:0em !important;"></div>';
                //if this has not been created
                if (!document.getElementById(ID))
                    document.getElementById("cachedInformation").innerHTML += toHTML;
                //if this has not been cached
                if (!document.getElementById(ID).innerHTML)
                    putHTMLHere(link, ID);
                return ID;
            }
            this.generateNodesFromTree = function(inputTree) {
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
            this.generateNodes = function(inputNodes, focusOnIndex) {
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
                    for(j = 0; j < model.nodes[i].connected.length; j++) {
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
        this.fix = function(scalarW, scalarH) {
            this.controller.fixMaxRadius();
            this.controller.setFocusOnIndex(model.head.index);
            for (var i = 0; i < model.nodes.length; i++) {
                model.nodes[i].finishTransition();
            }

        };
        function VIEW() {
            this.getBorderColors = function() {
                return [borderColor, backColor];
            };
            this.setBorderColors = function(border, back) {
                borderColor = border;
                backColor = back;
            };
            function drawEdge(n, o) {
                //drawing to other node
                var prn = n.getPosRad();
                var pro = o.getPosRad();
                var uv = [pro[0] - prn[0], pro[1] - prn[1]];
                var scalar = Math.sqrt(uv[0]*uv[0] + uv[1]*uv[1]);
                uv[0] /= scalar;
                uv[1] /= scalar;
                ctx.beginPath();
                ctx.moveTo(prn[0] + uv[0]*prn[2], prn[1] + uv[1]*prn[2]);
                ctx.lineTo(pro[0] - uv[0]*pro[2], pro[1] - uv[1]*pro[2]);
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
                ctx.font = Math.floor(pr[2]/2.6) + "px Arial";
                ctx.fillStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
		var splitText = "";
		if (n.text.length > 10 && n.text.search(" ") != -1) {
		    splitText = n.text.split(" ");
		    for (var i = 0; i < splitText.length; i++) {
			ctx.fillText(splitText[i], pr[0],
				     pr[1] - pr[2]*.8 +
				     (pr[2])*(i + 1)/splitText.length);
		    }
		} else if (n.text.length > 10 && n.text.search("-") != -1) {
		    splitText = n.text.split("-");
		    splitText[0] += "-"
		    for (var i = 0; i < splitText.length; i++) {
			ctx.fillText(splitText[i], pr[0],
				     pr[1] - pr[2]*.8 +
				     (pr[2])*(i + 1)/splitText.length);
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
                if (l == 1) return [0,0];
                for (var i = 0; i < l; i++) {
                    if (model.head.connected[i] == model.focus) {
                        var d = model.head.connRadians[i];
                        var rads = Math.PI / l;
                        return [d - rads, d + rads];
                    }
                }
                return [0,0];
            }

            function drawSegment(r1,r2, color, isFocus) {
                var p = model.head.getPosRadBase();
                p[2] *= 3;

                //getting the gradient set up
                var grd = null;
                if (isFocus) {
                    var t = model.focus.getPosRadBase();
                    var theta = Math.atan2(t[1] - p[1], t[0] - p[0]);
                    var shiftScale = .5;
                    grd=ctx.createRadialGradient(t[0] + Math.cos(theta)*t[2]*shiftScale,t[1] + Math.sin(theta)*t[2]*shiftScale,0,
                                                 p[0],p[1],p[2]);
                } else {
                    grd=ctx.createRadialGradient(p[0],p[1],0,
                                                 p[0],p[1],p[2]);
                }
                grd.addColorStop(0, color);
                grd.addColorStop(1, canvasColor);
                ctx.fillStyle=grd;

                //start the drawing
                ctx.moveTo(p[0],p[1]);
                ctx.beginPath();
                ctx.lineTo(p[0] + Math.cos(r1)*p[2], p[1] + Math.sin(r1)*p[2]);
                ctx.arc(p[0],p[1],p[2],r1,r2);
                ctx.lineTo(p[0],p[1]);
                ctx.fill();
            }

            this.drawSelectionWheel = function() {
                //first draw proper gradients
                var l = model.head.connected.length;
                if (model.head == model.focus) {
                    //drawing only off color
                    drawSegment(0,Math.PI*2, wheelHighlights.nonFocusColor, false);
                } else if (l == 1){
                    drawSegment(0, Math.PI * 2, wheelHighlights.focusColor, true);
                } else {
                    //draw directing at focus
                    var r = getDrawToPair();
                    drawSegment(r[0],r[1], wheelHighlights.focusColor, true);
                    //non focus to color rest grey
                    drawSegment(r[1],r[0], wheelHighlights.nonFocusColor, false);
                }
                //we are not drawing lines if only one thing
                if (l != 1) {
                    //do draw
                    var p = model.head.getPosRadBase();
                    p[2] *= 3.2;
                    var b = model.head.getPosRad()[2];
                    //getting the gradient set up
                    var grd=ctx.createRadialGradient(p[0],p[1],b,
                                                     p[0],p[1],p[2]);
                    grd.addColorStop(0, wheelHighlights.lineColor);
                    grd.addColorStop(1, canvasColor);
                    //drawing the lines
                    ctx.beginPath();
                    ctx.strokeStyle=grd;
                    ctx.lineWidth = "2";
                    var connRads = model.head.connRadians.slice(0);
                    var base = Math.PI / l;
                    for (var i = 0; i < l; i++) {
                        var r = connRads[i] + base;
                        ctx.moveTo(p[0],p[1]);
                        ctx.lineTo(p[0] + Math.cos(r)*p[2],
                                   p[1] + Math.sin(r)*p[2]);
                        ctx.stroke();
                    }
                }
            };
            this.draw = function() {
                for(var i = 0; i < model.nodes.length; i++) {
                    model.nodes[i].visited = false;
                }
                drawFromNode(model.head);
            };
            this.getIndexWith = function(text) {
                text = text.replace("%20", " ");
                for (var i = 0; i < model.nodes.length; i++) {
                    if (model.nodes[i].text != undefined &&
                        model.nodes[i].text == text) return i;
                }
                return 0;
            };
            this.getCurrentIndex = function() {
                return model.head.index;
            };
        }
        this.view = new VIEW();
    }

    this.node = new NODE();

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ Speck Object ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    function SPECK() {
        function Speck() {
            this.p = [Math.random() * (wallBound.right - wallBound.low)  + wallBound.low,
                      Math.random() * (wallBound.top - wallBound.low) + wallBound.low];
        }
        function MODEL() {
            this.specks = [];
            this.b = 0;//set behavior
            this.setBehaviors = [];
            this.active = 0;
            this.collector = function() {
                this.collected = [];
                this.max = 20;
            };
        }
        var model = new MODEL();
        this.controller = null;
        this.view = null;

        function CONTROLLER() {
            var speed = Math.max(width, height)/1000.0;
            this.updateSpeed = function() {
                speed = Math.max(width, height)/1000.0;
            };
            function linear(s) {
                if (s.p[0] < wallBound.low) {
                    s.v[0] = Math.abs(s.v[0]);
                }
                if (wallBound.right < s.p[0]) {
                    s.v[0] = Math.abs(s.v[0]) * -1;
                }
                if (s.p[1] < wallBound.low) {
                    s.v[1] = Math.abs(s.v[1]);
                }
                if (wallBound.top < s.p[1]) {
                    s.v[1] = Math.abs(s.v[1]) * -1;
                }
                s.p[0] += s.v[0] * speed;
                s.p[1] += s.v[1] * speed;
            }
            this.step = function() {
                var i;
                if (model.b == 0) {
                    if ($.inArray(model.b, model.setBehaviors) == -1) {
                        model.setBehaviors.push(model.b);
                        //need to add direction vectors
                        for (i = 0; i < model.active; i++) {
                            var rads = Math.random() * 2 * Math.PI;
                            model.specks[i].v = [Math.cos(rads), Math.sin(rads)];
                        }
                    }
                    for (i = 0; i < model.active; i++) {
                        linear(model.specks[i]);
                    }
                }
            };
            this.create = function(count, behave) {
                model.active = count;
                for (var i = model.specks.length; i < count; i++) {
                    model.specks.push(new Speck());
                }
            };
            this.setActiveCount = function(total) {
                if (total < model.specks.length)
                    model.active = total;
                else
                    this.create(total);
            };
            this.getActiveCount = function() {
                return model.active;
            };
            this.getTotal = function() {
                return model.specks.length;
            };

        }
        this.controller = new CONTROLLER();
        this.fix = function(scalarW, scalarH) {
            for (var i = 0; i < model.specks.length; i++) {
                model.specks[i].p[0] *= scalarW;
                model.specks[i].p[1] *= scalarH;
            }
            this.controller.updateSpeed();
        };
        function VIEW() {
            var minR = 6 * Math.min(width, height)/1000;
            var totalR = 4;
            var maxR = .5 * Math.min(width, height)/1000;

            function drawSpecks() {
                var i = 0;
                var j = 1;
                //draws different sized specks without saving all that info
                for (var r = minR; i < model.active; r += (maxR - minR) / totalR) {
                    ctx.lineWidth = r/3;
                    var part = Math.min(model.active, model.active * j++/totalR);
                    ctx.fillStyle = speckColor;
                    ctx.strokeStyle = speckColor;
                    for (; i < part; i++) {
                        ctx.beginPath();
                        ctx.arc(model.specks[i].p[0], model.specks[i].p[1], r, 2 * Math.PI, false);
                        if (i % 2) ctx.fill();
                        else ctx.fillStyle = null;
                        ctx.stroke();
                    }
                }

            }
            this.draw = function() {
                drawSpecks();
                cvsCtrl.speck.controller.step();
            };
        }
        this.view = new VIEW();
    }

    this.speck = new SPECK();
    function start() {

        ctx.clearRect(-100,-100, width + 100, height + 100);//-+100 to remove weird things
        if (getSec() - cvsCtrl.getLastMovement() > 1) {
            cvsCtrl.node.controller.clearBackPath();
        } else  {
            cvsCtrl.node.view.drawSelectionWheel();
        }
        cvsCtrl.speck.view.draw();
        cvsCtrl.node.view.draw();
        setTimeout(function() { start(); }, mspf);
    }
    function keepPageUpdatedWithURL() {
        var takeTo = window.location.toString().match(/\?node=(.+)/i);//getting their url destination
        var index = cvsCtrl.node.view.getIndexWith(takeTo[1]);
        if (cvsCtrl.node.view.getCurrentIndex() != index)
            cvsCtrl.node.controller.setFocusOnIndex(index);
        setTimeout(function() { keepPageUpdatedWithURL(); }, mspf*10);
    }
    this.draw = function() {
        start();
        keepPageUpdatedWithURL();
        ctx.translate(.5,.5);
    };

};


/*
 *                                          (green - child)
 *                                                 |
 *                     (red - parent)-----------(white)---------(green - child)
 *                                                 |
 *                                          (green - child)
 *
 *
 *
 */




$(document).ready( function() {
    //constructor for tree structure
    function Tree(text, link, children) {
        if (text != undefined) this.text = text;
        if (link != undefined) this.link = link;
        if (children != undefined) this.T = children;
    }

    var T = new Tree(
        "Welcome",
        "welcome.html",
        [new Tree(
            "Projects",
            "projects.html",
            [new Tree("PubSub", "PubSub.html"),
             new Tree(
                "Multi-Robot", "multiAgentEnvironment.html"),
             new Tree("Github",
                      "github.html",
                      [new Tree("Door Lock", "doorLockControl.html"),
                       new Tree("IOT Control", "IOTControl.html"),
		       new Tree("School",
				"school.html",
				[new Tree("Computer Graphics", "computerGraphics.html"),
				 new Tree("Data Science", "dataScience.html"),
				 new Tree("Cluster Computing", "clusterComputing.html")
				]),
		       new Tree("Emacs Init", "portableEmacs.html")
                      ]),
             new Tree(
                 "Website",
                 "websiteInfo.html")
            ]),
         new Tree(
             "About Me",
             "about.html",
             [
                 new Tree("Resume", "resume.html"),
                 new Tree("Contact", "contact.html")
             ])
        ]);


    $("body").css("min-height", $("body").height() + 2 + "px");
    var takeTo = window.location.toString().match(/\?node=(.+)/i);//getting their url destination

    cvsCtrl = new canvasModel();
    cvsCtrl.node.controller.generateNodesFromTree(T);
    var specks = 200;
    function changeImage(ID, newImage) {
        document.getElementById(ID).innerHTML = "<img src=\"" + newImage + "\"></div>";
    }

    cvsCtrl.speck.controller.create(specks, 0);
    cvsCtrl.draw();
    if (takeTo != null) changeTo(window.decodeURIComponent(takeTo[1]));//take them to the desired url



    cvsCtrl.getCanvas().addEventListener('click', function(event) {
        cvsCtrl.node.controller.clickEvent(event); }, false);
    cvsCtrl.getCanvas().addEventListener('mousemove', function(event) {
        cvsCtrl.node.controller.mouseReact(event); }, false);


    if (reduceMotion) {
        document.getElementById('motionButton').innerHTML = "Slide Motion On";
    } else {
        document.getElementById('motionButton').innerHTML = "Slide Motion Off";
    }



});

$(window).resize(function() {
    $("body").css("min-height", $("body").height() + 2 + "px");
    $("#settings").css("min-height", $("body").height());
    cvsCtrl.resize();
});


$("#settings").resize(function() {
    cvsCtrl.resize();
});

function onHomeCLick() {
    cvsCtrl.node.controller.setFocusOnIndex(0);
}
function changeTo(text) {
    var index = cvsCtrl.node.view.getIndexWith(text);
    cvsCtrl.node.controller.setFocusOnIndex(index);
}



function changeImage(ID, ifNotStill, ifStill) {
    if (still != null) {
        if (still) {
            document.getElementById(ID).innerHTML = "<img src=\"" + ifStill + "\"></div>";
        } else {
            document.getElementById(ID).innerHTML = "<img src=\"" + ifNotStill + "\"></div>";
        }
    } else {
        setTimeout(function() { changeImage(ID, ifNotStill, ifStill); }, 100);
    }
}




function getSec() { return (new Date()).getTime()/1000.0; };
function getLinearScalar(baseTime, totalTime) {
    var current = getSec() - baseTime;
    return current < totalTime ? current/totalTime : 1;
}
function navTransition(startEM, endEM) {
    var transitions = 100;
    var tTime = 100;//ms
    var baseTime = getSec();
    for (var i = 0; i <= transitions; i++) {
        setTimeout(function () { document.getElementById("settings").style.minWidth = (startEM + (endEM - startEM) * getLinearScalar(baseTime, tTime/1000.0)).toPrecision(2) + "em";},  tTime * i / (transitions - 1));
    }
    /*
    var updates = Math.ceil(transitions/10);
     for (var i = 0; i <= updates; i++) {
        setTimeout(function() { if (cvsCtrl) cvsCtrl.resize(); },
                   tTime * i / (Math.ceil(updates - 1)));
    }*/

}
function navButtonClick() {
    var ele = document.getElementById("settings").style.minWidth;
    if (parseFloat(ele[0] + ele[1]) > 10)
        navTransition(15, 0);
    else {
        navTransition(0, 15);
    }
}

function toggleMotion() {
    reduceMotion = !reduceMotion;
    if (reduceMotion) {
        document.getElementById('motionButton').innerHTML = "Slide Motion On";
    } else {
        document.getElementById('motionButton').innerHTML = "Slide Motion Off";
    }
}
function toggleSpecks() {
    if (cvsCtrl.speck.controller.getActiveCount() > 0) {
        cvsCtrl.speck.controller.setActiveCount(0);
        document.getElementById('specksButton').innerHTML = "Toggle Specks On";
    } else {
        cvsCtrl.speck.controller.setActiveCount(cvsCtrl.speck.controller.getTotal());
        document.getElementById('specksButton').innerHTML = "Toggle Specks Off";
    }
}
