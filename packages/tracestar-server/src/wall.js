import Promise from 'bluebird';

import {wallType, wallTypes} from './variables';

import {getRandomInt} from './random';

/*
    Return a random starting position in the middle of the board.
*/
export async function getRandomWall({start, end}) {

    const [initX, initY, wallTypeIndex] = await Promise.all([
        getRandomInt(start[0], end[0]),
        getRandomInt(start[1], end[1]),
        getRandomInt(0, wallTypes.length - 1)
    ]);

    // Do a deep copy of the array
    const wallShape = JSON.parse(JSON.stringify(wallType[wallTypes[wallTypeIndex]]));

    // Adding the origin
    wallShape.push([0, 0]);

    return wallShape.map(([x, y]) => [
        initX[0] + x,
        initY[0] + y
    ]);
}
