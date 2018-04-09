const http = require('http');

const port = process.env.PORT || process.env.NODE_PORT || 8000;

async function onRequest(req, res) {

    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Content-Type': 'application/json'
    };

    res.writeHead(200, headers);

    switch (req.url) {
        case '/start':
            res.write(JSON.stringify({x:0, y: 0}));
            break;
        case '/end':
            res.write(JSON.stringify({x:0, y: 0}));
            break;
        default:
            res.writeHead(404, headers);
            res.write(JSON.stringify(new Error('URL not recognized')));
    }

    res.end();
};

http.createServer(onRequest).listen(port);

console.log(`Listening on localhost:${port}`);
