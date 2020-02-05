## Description
This is a demo for running a RTLS using `docker`

## Running
For running the application you need to install `docker` and `docker-compose`.

Also this application uses the port `8000`, `8100` and `6379`.

Then run:
```
docker-compose up -d
```

You can see the application running on `http://localhost:8100`

### Increasing Publisher
To increase the amount of devices to emulate you need use the `--scale` command 
from docker compose and specify the amount of devices you wish to run

```
docker-compose up -d --scale device=10
```

## Architecture

### Redis
We are using redis as a `pub/sub` communication using channels and also storing the history of location for each `publisher`

### Client
This is a script that emulate devices sending their `latitude` and `longitude`

### Publisher
This is a program that takes the incomming request of the devices and sends them to `redis`

### Subscriber 
This is a program serves as a `Websocket` server and as a `subscription` to `redis`, is listening to all the locations that gets send over the `locations` channel and broadcast all those locations to the connected service.

We are using `Socket.io` for the websocket communication.

### Client
This is a web page, that connects to the `subscriber` using `websocket` and get the information from all the `publishers` and displays them in real time in a map. 

We are using `leaflet` for the `map` implementation and `socket.io` for the `ws` communication.


