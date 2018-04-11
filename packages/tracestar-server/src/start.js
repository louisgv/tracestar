import Promise from 'bluebird';
import fetch from 'node-fetch';
fetch.Promise = Promise;

import {getRandomInt} from './random';

/*
    Return a random starting position in the middle of the board.
*/
export async function getRandomStart({bound, end}) {

    const [xCoord, yCoord, foxImage] = await Promise.all([
        getRandomInt(2, bound.x - 2),
        getRandomInt(2, bound.y - 2),
        getFoxImage()
    ]);

    return [[xCoord[0], yCoord[0]], foxImage];
}

/*
    Grab a random fox image from random fox API
*/
async function getFoxImage() {
    const data = await fetch('https://randomfox.ca/floof/');

    const dataJson = await data.json();

    return dataJson.image;
}
