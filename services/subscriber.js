const server = require('http').createServer();
const io = require('socket.io')(server);
    
const redis = require('redis');


const port = !!process.env.PORT ? parseInt(process.env.PORT) : 8000;

let clientsMap = new Map();

setTimeout(() => {
    const sub = redis.createClient(process.env.REDIS_URL);

    sub.on('ready', function(err) {
        sub.subscribe('locations');
    });
    
    sub.on('message', function (channel, message) {
        if(channel === 'locations') {
            send(JSON.parse(message));
        }    
    });
    
    sub.on('error', function(err) {
        console.log('Error ' + err);
    });
    
    function send(location) {
        console.log(location);
        for(const [_, client] of clientsMap.entries()) {
            client.emit('location', location);
        }
    }
}, 2000);


io.on('connection', client => {
    clientsMap.set(client.id, client);

    client.on('disconnect', () => {
        clientsMap.delete(client.id);
    })
});

console.log(`SERVER LISTENING ON PORT ${port}`)
io.listen(port);