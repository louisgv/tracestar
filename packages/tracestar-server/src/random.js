import Promise from 'bluebird';
import fetch from 'node-fetch';
fetch.Promise = Promise;

// Temporary non-persistent to keep track of limit
let requestsLeft = 0;

/* Get random integer from random.org API */
export async function getRandomInt(a, b, n = 1) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json"
    };
    const min = Math.min(a, b);
    const max = Math.max(a, b);
    try {
        if (process.env.TEST) {
            throw 999;
        }
        if (requestsLeft <= 180) {
            throw 666;
        }
        const reqId = (new Date()).getTime();
        const data = await fetch('https://api.random.org/json-rpc/1/invoke', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: reqId,
                jsonrpc: '2.0',
                method: 'generateIntegers',
                params: {
                    apiKey: process.env.RANDOM_ORG_API_KEY,
                    n,
                    min,
                    max,
                    replacement: true
                }
            })
        });

        const dataJson = await data.json();

        if (dataJson.id !== reqId) {
            throw new Error('RANDOM.ORG ID MISMATCH!');
        }

        requestsLeft = dataJson.requestsLeft;

        return dataJson.result.random.data;
    } catch (e) {
        switch (e) {
            case 999:
                console.warn('RANDOM.ORG IS IN TESTING');
                break;
            case 666:
                console.warn(`RANDOM.ORG LIMIT IS GETTING LOW : ${requestsLeft} REQ LEFT`);
                break;
            default:
                console.error(e);
        }
        
        return Array.from({
            length: n
        }, () => Math.floor(Math.random() * (max + 1 - min) + min));
    }
}
