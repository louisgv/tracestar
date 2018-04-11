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
            throw new Error('RANDOM.ORG IS IN TESTING');
        }
        if (requestsLeft <= 180) {
            throw new Error('RANDOM.ORG LIMIT GETTING LOW');
        }
        const reqId = (new Date()).getTime();
        const data = await fetch('https://api.random.org/json-rpc/1/invoke', {
            method: 'POST',
            headers,
            body: JSON.stringify({
                id: reqId,
                jsonrpc: "2.0",
                method: "generateIntegers",
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
        console.error(e);
        return Array.from({
            length: n
        }, () => Math.floor(Math.random() * (max - min) + min));
    }
}
