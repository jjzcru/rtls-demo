const redis = require('redis');
const client = redis.createClient(process.env.REDIS_URL);

const id = uuidv4();
const position = {
  lat: 8.971642952356625,
  long: -79.55633640289308
}
console.log(`Id: ${id}`);

client.on('ready', function(err) {
	setInterval(() => {
		publish();
	}, 3000);
});

client.on('error', function(err) {
	console.log('Error ' + err);
});

let latIncrease;
let longIncrease;

function publish() {
  if(!latIncrease) {
    latIncrease = getRandomIncrease() * getSign();
  }
  if(!longIncrease) {
    longIncrease = getRandomIncrease() * getSign();
  }

  position.lat = position.lat + latIncrease;
  position.long = position.long + longIncrease;
  position.time = Date.now();
  
  console.log(`Latitude: ${position.lat} \tLongitude: ${position.long}`);

  client.rpush(id, JSON.stringify(position));
  client.publish('locations', JSON.stringify({
    id: id,
    lat: position.lat,
    long: position.long,
    time: position.time
  }));
}

function getSign() {
  return getRandomInt(0, 100) % 2 ? 1 : -1;
}

function getRandomIncrease() {
  const min = 0.0000;
  const max = 0.0001;
  return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function uuidv4() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		var r = (Math.random() * 16) | 0,
			v = c == 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
