import Promise from 'bluebird';

/* Post processing
    Adapted from https://stackoverflow.com/questions/4295782/how-do-you-extract-post-data-in-node-js#4310087
 */

export function getPostData(request, response, limit = 1e6) {

    return new Promise(function(resolve, reject) {
        let queryData = "";

        if (request.method == 'POST') {
            request.on('data', function(data) {
                queryData += data;
                if (queryData.length > limit) {
                    queryData = "";
                    response.writeHead(413, {'Content-Type': 'text/plain'}).end();
                    request.connection.destroy();
                    reject(new Error('DATA TOO BIG'));
                }
            });

            request.on('end', function() {
                try {
                    resolve(JSON.parse(queryData));
                } catch (e) {
                    reject(e);
                }
            });

        } else {
            response.writeHead(405, {'Content-Type': 'text/plain'});
            response.end();
            reject(new Error('NOT A POST REQUEST'));
        }
    });
}
