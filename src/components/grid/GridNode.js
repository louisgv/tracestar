/*
	Author: LAB

	Grid Node module.
	Used to draw interactive grid node into the canvas.

    LICENSE: MIT
*/

"use strict";
var app = app || {};

(function() {
    const {Square, Vector2} = app;

    app.GridNode = class extends Square {
        constructor(pos = new Vector2(), size = 10, textConfig = {}, color = 'white', textColor = 'black', text = {
            topLeft: 0,
            topRight: 0,
            bottomCenter: 'S'
        }) {
            super(pos, size, color);
            this.text = text;
            this.textColor = textColor;

            // TODO: Cache these config somewhere else
            this.textSize = textConfig.textSize;

            this.textAlignAndBaseline = textConfig.textAlignAndBaseline;

            this.textArgv = textConfig.textArgv;

            this.texts = textConfig.texts;
        }

        draw(ctx) {
            ctx.save();
            ctx.fillStyle = this.color;

            ctx.translate(this.pos.x - this.halfSize, this.pos.y - this.halfSize);
            ctx.fillRect(0, 0, this.size, this.size);

            ctx.fillStyle = this.textColor;
            this.texts.forEach((t) => {
                ctx.save();

                ctx.font = `${this.textSize[t]}px comfortaa`;
                ctx.textAlign = this.textAlignAndBaseline[t][0];
                ctx.baseline = this.textAlignAndBaseline[t][1];
                ctx.translate.apply(ctx, this.textArgv[t]);
                ctx.fillText(this.text[t], 0, 0);

                ctx.restore();
            });

            ctx.restore();
        }
    };
}());
