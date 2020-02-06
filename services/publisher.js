const bodyParser = require('body-parser');
const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

var express = require('express');

client.on('ready', function(err) {
	startServer();
});

client.on('error', function(err) {
	console.log('Error ' + err);
});

function startServer() {
  var app = express();
  
  app.use(
    bodyParser.urlencoded({
      extended: true
    })
  )

	app.use(bodyParser.json());

	app.post('/location', (req, res) => {
    const location = req.body.location;
    location.time = Date.now();
		client.rpush(location.id, JSON.stringify(location));
		client.publish('locations', JSON.stringify(location));
		res.send(location);
  });
  
  const port = !!process.env.PORT ? parseInt(process.env.PORT) : 3000;
  console.log(`Server running on port ${port}!`);
	app.listen(port);
}