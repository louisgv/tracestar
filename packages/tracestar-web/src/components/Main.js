/*
	Author: LAB
	Main app module for pattar

    LICENSE: MIT
*/

// An IIFE ("Iffy") - see the notes in mycourses
"use strict";
var app = app || {};
(function() {

    const {Random, Interface, Global, Helper} = app;

    app.Main = class {
        constructor() {
            this.sound = undefined;
            this.keyboard = undefined;
            this.drawpad = undefined;
            this.animationID = 0;
            this.paused = false;
            this.initialized = false;
        }

        /** Setup the main process and start animation
         *
         */
        async init() {
            await this.setupUI();

            // start animation loop
            this.update();
        }

        /** Halt the program
         *
         */
        halt() {
            Helper.showPause();
            this.paused = true;
            cancelAnimationFrame(this.animationID);
            this.update();
        }

        /** Resume the application
         */
        resume() {
            Helper.hidePause();
            cancelAnimationFrame(this.animationID);
            this.paused = false;
            this.update();
        }



        /** Setup any caching layer of any module it depends on.
         *
         */
        async setupCache() {
            Helper.showNotice('- RANDOMIZING -');

            await this.drawpad.setupCache();

            await Helper.wait(900);

            Helper.hideNotice();
        }

        /** UI Setup for the main application
         *
         */
        async setupUI() {
            Helper.showNotice(`<h2>- LOADING -</h2>`);

            this.toggleUIButton = document.querySelector('#toggleui-button');
            this.toggleUIButton.addEventListener('click', Helper.toggleUIElement);

            await this.drawpad.setupUI();

            await this.drawpad.setupCache();

            this.initialized = true;
            Helper.hideNotice();

            Helper.showDialog(`
                <h1>Welcome to TraceStar!</h1>
                <p>
                    This is an educational application that seeks to show you how the A* path finding algorithm work. You will be the "Priority Queue" of the A* program, where you will determine which block should the algorithm choose next!
                <p/>
                <p>
                    Click a GREEN tile to advance toward that tile. The goal is to find a path from the START to the END with the least amount of movement.
                <p/>
                <p>Have fun!</p>
            `, 'START');
        }

        /** Update loop for animation
         *
         */
        update() {
            // this schedules a call to the update() method in 1/60 seconds
            this.animationID = requestAnimationFrame(() => this.update());

            if (this.paused || !this.initialized) {
                return;
            }

            let dt = this.getDeltaTime();

            this.drawpad.render(dt);
        }

        /** Handle user input in late update
         *
        */
        lateUpdate() {
            if (!this.keyboard) {
                return;
            }

            // if (this.keyboard.isComboDown('GENERATE')) {
            //     this.drawpad.grid.();
            // }
        }

        /** Calculate the delta time
         *
        */
        getDeltaTime() {
            const now = performance.now();
            let fps = 1000 / (now - this.lastTime);
            fps = Helper.clamp(fps, 12, 60);
            this.lastTime = now;
            return 1 / fps;
        }
    };
}());
