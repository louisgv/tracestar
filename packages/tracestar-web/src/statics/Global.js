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
        : 'https://tracestar-server-exwsopcxzr.now.sh',
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
        KEY_LEFT: 37,
        KEY_UP: 38,
        KEY_RIGHT: 39,
        KEY_DOWN: 40,
        KEY_SPACE: 32,
        KEY_SHIFT: 16
    },
    BASIC_SHAPE: {
        Circle: 'Circle',
        Square: 'Square',
        Triangle: 'Triangle',
        Diamond: 'Diamond'
    }
});
