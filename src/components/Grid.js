/*
	Author: LAB
	Grid module for tracestar

    LICENSE: MIT
*/

// An IIFE ("Iffy") - see the notes in mycourses
"use strict";
var app = app || {};
(function() {
    const {Vector2, Helper, GridNode} = app;

    app.Grid = class {
        constructor(config = {
            sideScale: 0.16,
            padding: 0.02
        }) {
            this.config = config;

            this.config.gridNodeScale = (this.config.sideScale - this.config.padding * 2);
        }

        // Update config based on the canvas
        updateConfig(canvas) {
            const windowMinSize = Math.min(window.innerWidth, window.innerHeight);
            const nodeSize = windowMinSize * this.config.gridNodeScale;
            const paddingSize = windowMinSize * this.config.padding;
            const totalNodeSize = nodeSize + paddingSize;

            this.config.renderSize = window.innerWidth > window.innerHeight
                ? new Vector2(
                    Math.floor(window.innerWidth / totalNodeSize) - 1,
                    Math.floor(1 / this.config.sideScale) - 1
                )
                : new Vector2(
                    Math.floor(1 / this.config.sideScale) - 1,
                    Math.floor(window.innerHeight / totalNodeSize) - 1
                );

            this.config.nodeSize = nodeSize;
            this.config.totalNodeSize = totalNodeSize;

            this.updateCache();
        }

        updateCache() {
            this.nodeCache = new Array(this.config.renderSize.x);
            for (let x = 0; x < this.config.renderSize.x; x++) {
                this.nodeCache[x] = new Array(this.config.renderSize.y);
                for (let y = 0; y < this.config.renderSize.y; y++) {
                    this.nodeCache[x][y] = new GridNode(new Vector2(
                        x * (this.config.totalNodeSize) + this.config.nodeSize,
                        y * (this.config.totalNodeSize) + this.config.nodeSize
                    ), this.config.nodeSize);
                }
            }
        }

        processMouseInput(mouse) {
            const x = Math.floor((mouse.x - this.config.nodeSize * 1.5) / (this.config.totalNodeSize)) + 1;
            const y = Math.floor((mouse.y - this.config.nodeSize * 1.5) / (this.config.totalNodeSize)) + 1;

            if (this.nodeCache[x] && this.nodeCache[x][y]) {
                this.nodeCache[x][y].color = 'black';
            }
        }

        // Draw the Pattern into the ctx
        draw(ctx) {
            ctx.save();
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

            this
                .nodeCache
                .forEach((row) => {
                    row.forEach((node) => {
                        node.draw(ctx);
                    });
                });

            ctx.restore();
        }

    };
}());
