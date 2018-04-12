/*
	Author: LAB

	Global singleton
	Used to share global config

    LICENSE: MIT
*/

"use strict";
var app = app || {};

app.Global = Object.freeze({
    DEBUG: window.location.host === 'localhost:3000',
    HALF_PI: Math.PI / 2,
    TWO_PI: Math.PI * 2,
    API_URL: window.location.host === 'localhost:3000'
        ? 'http://localhost:8080'
        : 'https://tracestar-server-xmqkvrjysb.now.sh',
    COLOR: {
        BLANK: "#EEEEEE",
        WALL: "#333333",
        VISITED: "#FD5B78",
        PATH: "#FF6037",
        ORANGE: "#FF9966",
        YELLOW: "#FFFF66",
        QUEUED: "#66FF66",
        START: "#50BFE6",
        PINK: "#FF6EFF",
        END: "#EE34D2"
    },
    KEYBOARD: {
        LEFT: 37,
        UP: 38,
        RIGHT: 39,
        DOWN: 40,
        SPACE: 32,
        SHIFT: 16,
        ESC: 27,
        CTRL: 17,
        r: 82,
        s: 83,
        v: 86,
    },
    BASIC_SHAPE: {
        Circle: 'Circle',
        Square: 'Square',
        Triangle: 'Triangle',
        Diamond: 'Diamond'
    }
});
