/*
	Author: LAB
	Grid module for tracestar

    LICENSE: MIT
*/

// An IIFE ("Iffy") - see the notes in mycourses
"use strict";
var app = app || {};
(function() {
    const {Vector2, Fetcher, Global, Helper, GridNode} = app;

    app.Grid = class {
        constructor(config = {
            sideScale: 0.16,
            padding: 0.02,
            minHeuristic: 3,
            start: [],
            end: [],
            wall: [],
            pathFound: false
        }) {
            this.config = config;

            this.config.gridNodeScale = (this.config.sideScale - this.config.padding * 2);
        }

        // Update config based on the canvas
        async updateConfig(canvas) {
            const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
            const nodeSize = windowMinSize * this.config.gridNodeScale;
            const paddingSize = windowMinSize * this.config.padding;
            const totalNodeSize = nodeSize + paddingSize;

            this.config.renderSize = window.innerWidth > window.innerHeight
                ? new Vector2(Math.floor(window.innerWidth / totalNodeSize) - 1, Math.floor(1 / this.config.sideScale) - 1)
                : new Vector2(Math.floor(1 / this.config.sideScale) - 1, Math.floor(window.innerHeight / totalNodeSize) - 1);

            this.config.nodeSize = nodeSize;
            this.config.totalNodeSize = totalNodeSize;

            const [end, starImageUrl] = await Fetcher.getRandomEnd(this.config.renderSize);

            const [start, dogImageUrl] = await Fetcher.getRandomStart(this.config.renderSize, end, this.config.minHeuristic);

            const [wall, starImage, dogImage] = await Promise.all([
                Fetcher.getRandomWall(start, end),
                Helper.createImage(starImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/6/6a/Merope.jpg'),
                Helper.createImage(dogImageUrl || 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/8b/Husky_on_San_Francisco_sidewalk.jpg/480px-Husky_on_San_Francisco_sidewalk.jpg')
            ]);

            this.config.endImage = starImage;
            this.config.startImage = dogImageUrl;

            this.config.end = end;
            this.config.start = start;

            this.config.wall = wall;

            this.updateCache();
        }

        /*
            Initialize the cache for label and configuration
        */
        updateCache() {
            this.config.pathFound = false;

            const sixthSize = this.config.nodeSize / 6;
            const fifthSize = this.config.nodeSize / 5;

            this.config.textSize = {
                topLeft: sixthSize,
                topRight: sixthSize,
                bottomCenter: fifthSize
            };

            this.config.textLabel = {
                topLeft: 'h: ',
                topRight: 'g: ',
                bottomCenter: 'F: '
            };

            this.config.textAlignAndBaseline = {
                topLeft: [
                    "center", "bottom"
                ],
                topRight: [
                    "center", "bottom"
                ],
                bottomCenter: ["center", "middle"]
            };

            this.config.textArgv = {
                topLeft: [
                    this.config.nodeSize / 2,
                    fifthSize + sixthSize / 2
                ],
                topRight: [
                    this.config.nodeSize / 2,
                    fifthSize * 2 + sixthSize / 2
                ],
                bottomCenter: [
                    this.config.nodeSize / 2,
                    fifthSize * 4
                ]
            };

            this.config.texts = Object.keys(this.config.textSize);

            this.nodeCache = Array.from({
               length: this.config.renderSize.x
           }, () => new Array(this.config.renderSize.y));

            for (let x = 0; x < this.config.renderSize.x; x++) {
                for (let y = 0; y < this.config.renderSize.y; y++) {
                    this.nodeCache[x][y] = new GridNode(new Vector2(x * (this.config.totalNodeSize) + this.config.nodeSize, y * (this.config.totalNodeSize) + this.config.nodeSize,), this.config.nodeSize, this.config, Global.COLOR.BLANK, Global.COLOR.WALL);

                    this.nodeCache[x][y].text.topLeft = this.getHeuristic(x, y);
                }
            }

            this.config.wall.forEach(([x, y]) => {
                if (this.nodeCache[x] && this.nodeCache[x][y]) {
                    this.nodeCache[x][y].color = Global.COLOR.WALL;
                }
            });

            const startNode = this.nodeCache[this.config.start[0]][this.config.start[1]];
            startNode.color = Global.COLOR.START;
            startNode.text.bottomCenter = 'START';
            startNode.textLabel = {
                topLeft: 'h: '
            };

            startNode.imageCache = this.config.startImage;

            const endNode = this.nodeCache[this.config.end[0]][this.config.end[1]];

            endNode.color = Global.COLOR.END;
            endNode.text.bottomCenter = 'END';
            endNode.textLabel = {};
            endNode.imageCache = this.config.endImage;

            this.markNeighbors(this.config.start[0], this.config.start[1]);
        }

        // Return the heuristic for a point given an end
        getHeuristic(x, y) {
            return Math.abs(x - this.config.end[0]) + Math.abs(y - this.config.end[1]);
        }

        // Get neighbor for a certain node
        getNeighbors(x, y) {
            const neighbors = [];
            if (this.nodeCache[x] && this.nodeCache[x][y + 1]) {
                neighbors.push(this.nodeCache[x][y + 1]);
            }

            if (this.nodeCache[x + 1] && this.nodeCache[x + 1][y]) {
                neighbors.push(this.nodeCache[x + 1][y]);
            }

            if (this.nodeCache[x - 1] && this.nodeCache[x - 1][y]) {
                neighbors.push(this.nodeCache[x - 1][y]);
            }

            if (this.nodeCache[x] && this.nodeCache[x][y - 1]) {
                neighbors.push(this.nodeCache[x][y - 1]);
            }

            return neighbors;
        }

        /*
            Mark all neighbor of the node
        */
        markNeighbors(x, y) {
            const currentNode = this.nodeCache[x][y];

            const neighbors = this.getNeighbors(x, y);

            neighbors.forEach((n) => {
                if (n.color == Global.COLOR.END) {
                    this.config.pathFound = true;
                    let cost = 0;
                    let trace = currentNode;
                    while (trace.color != Global.COLOR.START) {
                        trace.color = Global.COLOR.PATH;
                        trace = trace.origin;
                        cost ++;
                    }

                    Helper.showNotice(`
                        <h2>- PATH FOUND! -</h2>
                        <h3> COST : ${cost} STEPS </h3>
                        <p>press <b>R</b> to restart</p>
                    `);


                }

                if (!this.isAvailableNode(n)) {
                    return;
                }

                n.color = Global.COLOR.QUEUED;

                const newCost = currentNode.text.topRight + 1;

                // If node is visited and new cost is more, return
                if (n.visited && newCost >= n.text.topRight) {
                    return;
                }

                n.visited = true;

                n.text.topRight = newCost;

                n.text.bottomCenter = n.text.topLeft + n.text.topRight;

                n.origin = currentNode;
            });
            if (this.isAvailableNode(currentNode)) {
                currentNode.color = Global.COLOR.VISITED;
            }
        }

        /* Check if the node is available */
        isAvailableNode(currentNode) {
            return currentNode.color == Global.COLOR.BLANK || currentNode.color == Global.COLOR.QUEUED;
        }

        /* Process and map mouse input into the grid */
        processMouseInput(mouse) {
            const x = Math.floor((mouse.x - this.config.nodeSize * 1.5) / (this.config.totalNodeSize)) + 1;
            const y = Math.floor((mouse.y - this.config.nodeSize * 1.5) / (this.config.totalNodeSize)) + 1;

            if (this.nodeCache[x] && this.nodeCache[x][y]) {
                const currentNode = this.nodeCache[x][y];

                if (currentNode.color != Global.COLOR.QUEUED) {
                    return;
                }

                this.markNeighbors(x, y);
            }
        }

        // Draw the Grid into the ctx
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            this.nodeCache.forEach((row) => {
                row.forEach((node) => {
                    node.draw(ctx);
                });
            });

            ctx.restore();
        }

    };
}());
