const http = require('http');
const redis = require('redis');

const client = redis.createClient({
    socket: {
        host: 'redis-alias',
        port: 6379
    }
});

client.on('error', err => {
    console.log('Redis client error ' + err);
});

client.connect()
    .then(()=> client.set('key', Math.random()) )
    .then(()=>{
        http.createServer(trapper).listen(8080);
        console.log("_ listening ...");
    });


const trapper = function (req, res) {
    client.get('key')
        .then(val => {
            res.writeHead(200);
            res.end('secret: ' + val);
        });
}


