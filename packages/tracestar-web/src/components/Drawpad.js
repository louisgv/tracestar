/*
	Author: LAB
	Drawpad module for pattar

    LICENSE: MIT
*/

// An IIFE ("Iffy") - see the notes in mycourses
"use strict";
var app = app || {};
(function () {
    const {
        Vector2,

        Grid,

        Helper
    } = app;

    app.Drawpad = class {
        constructor() {
            this.dragging = false;
            this.renderCanvas = Helper.createElement(`
                <canvas id="main-canvas"></canvas>
            `);
            this.renderCanvasCtx = this.renderCanvas.getContext('2d');

            this.container = document.querySelector('#drawpad-container');

            this.container.appendChild(this.renderCanvas);

            this.grid = new Grid();
            this.gridCtx = Helper.createCtx();
        }

        // Cache the size as well as update config for some child module
        async setupCache() {
            this.renderCanvas.size = new Vector2(window.innerWidth, window.innerHeight);
            this.renderCanvas.center = this.renderCanvas.size.iMul(0.5);

            Helper.setFullsizeCtx(this.gridCtx);
            Helper.setFullsizeCtx(this.renderCanvasCtx);

            await this.grid.updateConfig(this.renderCanvas);
        }

        /** Setup UI for the drawpad */
        setupUI() {

            this.renderCanvas.addEventListener('mousedown', (e) => this.onMouseDownCanvas(e));
            this.renderCanvas.addEventListener('mousemove', (e) => this.onMouseMoveCanvas(e));
            this.renderCanvas.addEventListener('mouseup', (e) => this.onMouseUpCanvas(e));
            this.renderCanvas.addEventListener('mouseout', (e) => this.onMouseOutCanvas(e));
        }

        onMouseDownCanvas(e) {
            this.dragging = true;

            const mouse = Helper.getMouse(e);
            this.grid.processMouseInput(mouse);
        }

        onMouseMoveCanvas(e) {
            Helper.clearCanvas(this.renderCanvasCtx);

            if (!this.dragging) {
                return;
            }

            const mouse = Helper.getMouse(e);

        }

        onMouseUpCanvas(e) {

            this.dragging = false;
        }

        // if the user drags out of the canvas
        onMouseOutCanvas(e) {

            this.dragging = false;
        }

        // Render the drawpad into the canvas's ctx
        render(dt) {
            this.grid.draw(this.gridCtx);

            this.renderCanvasCtx.drawImage(this.gridCtx.canvas, 0, 0);

            Helper.clearCanvas(this.gridCtx);
        }

    };
}());
