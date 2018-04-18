/*
	Author: LAB
	Helper methods singleton. Generic and not opinionated

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {

    const {Vector2} = app;

    // Showing a dialog modal
    async function showDialog(text, nextText = "NEXT", fadeDuration = 500) {

        const announceEl = document.querySelector('#announce-overlay');

        const announceText = announceEl.querySelector('#announce-text');

        announceText.innerHTML = text;

        const dialogButton = dialogCloseButton(nextText);

        announceEl.appendChild(dialogButton);
        announceEl.classList.add("Show");

        await new Promise((resolve, reject) => {
            dialogButton.addEventListener('click', resolve);
        });

        announceEl.classList.remove("Show");

        await wait(fadeDuration);

        dialogButton.remove();
    }

    // Generate the dialog close button
    function dialogCloseButton(text = "NEXT") {
        const button = createElement(`<button class="dialog-button"></button>`);

        button.innerHTML = text;

        return button;
    }

    // Create html element. Code adapted from
    // https://stackoverflow.com/questions/494143/creating-a-new-dom-element-from-an-html-string-using-built-in-dom-methods-or-pro/35385518#35385518
    function createElement(html) {
        const template = document.createElement('template');
        html = html.trim(); // Never return a text node of whitespace as the result
        template.innerHTML = html;
        return template.content.firstChild;
    }

    // Asyncronously wait for a duration in ms
    function wait(duration) {
        return new Promise(function(resolve, reject) {
            setTimeout(resolve, duration);
        });
    }

    app.Helper = {
        createElement,
        showDialog,
        wait,
        /* Create an image asyncronously */
        createImage: (url) => new Promise((resolve, reject) => {
            const img = new Image();
            img.src = url;
            img.addEventListener('load', () => resolve(img));
            img.addEventListener('abort', reject);
        }),

        // Show the pause overlay
        showPause() {
            document.querySelector('#halt-notice').classList.add('enabled');
        },

        // Hide the pause overlay
        hidePause() {
            document.querySelector('#halt-notice').classList.remove('enabled');
        },

        /* Show the notice board */
        showNotice(message) {
            const noticeEl = document.querySelector('#generic-notice');
            noticeEl.innerHTML = message;
            noticeEl.classList.add('enabled');
        },

        /* Hide the notice board */
        hideNotice() {
            document.querySelector('#generic-notice').classList.remove('enabled');
        },

        // Create a quick canvas context for temporary drawing.
        createCtx: () => document.createElement("canvas").getContext('2d'),

        // Set the ctx's canvas to full window inner size
        setFullsizeCtx(ctx) {
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = window.innerHeight;
        },

        getUrlQueryString(origin, qs) {
            // https://fetch.spec.whatwg.org/#fetch-api
            const url = new URL(origin);
            Object.keys(qs).forEach(key => url.searchParams.append(key, qs[key]));
            return url;
        },

        // Toggle all toggle target based on the menu button state
        toggleUIElement(e) {

            const shouldDisable = e.target.innerText === 'x';

            e.target.innerHTML = shouldDisable
                ? '='
                : 'x';

            Array.from(document.querySelectorAll('.toggle-target')).map((target) => {
                target.classList.toggle('toggle-disabled');
            });
        },
        clamp(val, min, max) {
            return Math.max(min, Math.min(max, val));
        },
        // Return a random between min and max
        getRandomInt: (a, b) => Math.floor(Math.random() * Math.abs(a - b) + Math.min(a, b)),

        // Get Mouse position relative to the element
        getMouse: ({pageX, pageY, target}) => new Vector2(pageX - target.offsetLeft, pageY - target.offsetTop),
        // Clear the canvas
        clearCanvas(ctx) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        },

        // Request the user to fullscreen the visualization
        requestFullscreen(element) {
            if (element.requestFullscreen) {
                element.requestFullscreen();
            } else if (element.mozRequestFullscreen) {
                element.mozRequestFullscreen();
            } else if (element.mozRequestFullScreen) { // camel-cased 'S' was changed to 's' in spec
                element.mozRequestFullScreen();
            } else if (element.webkitRequestFullscreen) {
                element.webkitRequestFullscreen();
            }
            // .. and do nothing if the method is not supported
        }
    };
}());
