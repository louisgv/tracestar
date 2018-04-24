import Promise from 'bluebird';
import fetch from 'node-fetch';
fetch.Promise = Promise;

import {getRandomInt} from './random';

/*
    Return a random starting position in the middle of the board.
*/
export async function getRandomStart({bound, end, limit}) {

    const [xPool, yPool, dogImage] = await Promise.all([
        getRandomInt(2, bound.x - 2, 1e4),
        getRandomInt(2, bound.y - 2, 1e4),
        getDogImage()
    ]);

    return [
        getStartWithDecentHeuristic(xPool, yPool, end, limit),
        dogImage
    ];
}

function getStartWithDecentHeuristic(xPool, yPool, end, limit) {
    let x = xPool.pop();
    let y = yPool.pop();

    if (xPool.length === 0 || yPool.length === 0) {
        return [x, y];
    }

    if (Math.abs(x - end[0]) + Math.abs(y - end[1]) >= limit) {
        return [x, y];
    }
    return getStartWithDecentHeuristic(xPool, yPool, end, limit);
}

/*
    Grab a random dog image from dog.ceo API
*/
async function getDogImage() {
    const data = await fetch('https://dog.ceo/api/breeds/image/random');

    const dataJson = await data.json();

    return dataJson.message;
}
