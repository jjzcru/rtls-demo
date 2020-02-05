const http = require('http')

const id = uuidv4();
const position = {
    id: id,
    lat: 8.971642952356625,
    long: -79.55633640289308
}

console.log(`Id: ${id}`);

let latIncrease;
let longIncrease;



setInterval(() => {
    publish();    
}, 3000);


function publish() {
  if(!latIncrease) {
    latIncrease = getRandomIncrease() * getSign();
  }
  if(!longIncrease) {
    longIncrease = getRandomIncrease() * getSign();
  }

  position.lat = position.lat + latIncrease;
  position.long = position.long + longIncrease;
  
  console.log(`Latitude: ${position.lat} \tLongitude: ${position.long}`);

  sendLocation({
      id: position.id,
      lat: position.lat,
      long: position.long
  });
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

function sendLocation(data) {
    const content = JSON.stringify({location: data});
    const options = {
        hostname: process.env.HOST || 'localhost',
        port: !!process.env.PUBLISHER_PORT ? parseInt(process.env.PUBLISHER_PORT) : 3000,
        path: '/location',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': content.length
        }
      }      
      const req = http.request(options)
      
      req.on('error', error => {
        console.error(error)
      });
      
      req.write(content)
      req.end()
}
