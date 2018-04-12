import Promise from 'bluebird';
import fetch from 'node-fetch';
fetch.Promise = Promise;

import {getRandomInt} from './random';

let cachedRandom = [];

/*
    Return an end position at the corner of the board
*/
export async function getRandomEnd({bound}) {

    try {
        const starImagePromise = getStarImage();

        let cachedRandomPromise = null;

        if (cachedRandom.length === 0) {
            cachedRandomPromise = getRandomInt(0, 3, 1e4);
        }

        const [starImage, newCachedRandom] = await Promise.all([starImagePromise, cachedRandomPromise]);

        if (newCachedRandom) {
            cachedRandom = newCachedRandom;
        }

        const pos = getEdge(bound, cachedRandom.pop(), 1);

        return [pos, starImage];
    } catch (e) {
        console.error('GET END IS DOWN:', e);
        return [[1,1], ''];
    }
}

/*
    Get the edge of the bound based on pos
*/
function getEdge(bound, pos, min) {
    console.log(bound, pos, min);
    switch (pos) {
        case 1:
            return [
                min, bound.y - min - 1
            ];
        case 2:
            return [
                bound.x - min - 1,
                bound.y - min - 1
            ];
        case 3:
            return [
                bound.x - min - 1,
                min
            ];
        case 0:
        default:
            return [min, min];
    }
}

/*
    Grab a star image from the NASA image of the day API
*/
async function getStarImage() {
    const data = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${process.env.NASA_API_KEY}`);

    const dataJson = await data.json();

    return dataJson.url;
}
