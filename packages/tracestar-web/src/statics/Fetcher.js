/*
	Author: LAB

	Fetcher singleton
    Used to implement fetch based API call

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Global, Helper} = app;

    app.Fetcher = class {

        // Return a random ending position given
        // the limit
        static async getRandomEnd(bound) {
            const data = await fetch(`${Global.API_URL}/end`, {
                method: "POST",
                body: JSON.stringify({bound})
            });

            return data.json();
        }

        static async getRandomStart(bound, end) {
            const data = await fetch(`${Global.API_URL}/start`, {
                method: "POST",
                body: JSON.stringify({bound, end})
            });

            return data.json();
        }

        static async getRandomWall(bound, end) {
            const data = await fetch(`${Global.API_URL}/wall`, {
                method: "POST",
                body: JSON.stringify({bound, start, end})
            });

            return data.json();
        }

    };

}());
