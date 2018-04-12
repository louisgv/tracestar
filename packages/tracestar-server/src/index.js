require('dotenv').config();

import http from 'http';
import querystring from 'querystring';

import {getPostData} from './utils';

import {getRandomStart} from './start';

import {getRandomEnd} from './end';

import {getRandomWall} from './wall';

const port = process.env.PORT || process.env.NODE_PORT || 8080;

async function onRequest(req, res) {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    res.writeHead(200, headers);

    const data = await getPostData(req, res);

    console.log('POST data: ', data);

    // Helper.getRandomInt(1, this.config.renderSize.x - 1);

    switch (req.url) {
        case '/end':
            const endPoint = await getRandomEnd(data);
            res.write(JSON.stringify(endPoint));
            break;
        case '/start':
            const startPoint = await getRandomStart(data);
            res.write(JSON.stringify(startPoint));
            break;
        case '/wall':
            const wall = await getRandomWall(data);
            res.write(JSON.stringify(wall));
            break;
        default:
            res.writeHead(404, headers);
            res.write(JSON.stringify(new Error('URL not recognized')));
    }

    res.end();
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);
