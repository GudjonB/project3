//Sample data for Project 3
const express = require('express');
const app = express(); /* Þarf þennan ? */
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser'); /* bodyparsed? */

var date = new Date();
var hours = date.getSeconds;

//The following is an example of an array of two stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [
    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [2]},
    {id: 2, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1,3,4]},
    {id: 10, description: "EGS", lat: 65.6856, lon: 18.1002, observations: []}
];

//The following is an example of an array of two observations.
//Note that an observation does not know which station it belongs to!
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
    {id: 3, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
    {id: 4, date: 1551842337409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},

];

let nextStationId = 11;
let nextObservationId = 3;

app.use(bodyParser.json()); /* Tell express to use the body parser module */

// Read all stations
app.get('/stations', (req, res) => {
    res.status(200).json(stations);
});

// Read an individual station
app.get('/stations/:id', (req, res) => {
    for (let i=0;i<stations.length;i++) {
        if (stations[i].id == req.params.id) {
            res.status(200).json(stations[i]);
            return;
        }
    }
    res.status(404).json({'message': "Station with id " + req.params.id + " does not exist."});
});

// Create a new station
app.post('/stations', (req, res) => {
    if (req.body === undefined || req.body.description === undefined || req.body.lat === undefined || req.body.lon === undefined) {
        res.status(400).json({'message': "description, latitude and longitude fields are required in the request body"});
    } else {
        let newStation = {id:nextStationId, description: req.body.description, lat: req.body.lat, lon: req.body.lon, observations: []};
        stations.push(newStation);
        nextStationId++;
        res.status(201).json(newStation);
    }
});

// delete all stations
app.delete('/stations', (req, res) => {
    var returnArray = stations.slice();
    stations = [];
    res.status(200).json(returnArray);
});

// delete a single stations and all of its observations
app.delete('/stations/:id', (req, res) => {
    let obsToRet = [];
    let stationToRet = [];
    for (let i=0;i<stations.length;i++) {
        if (stations[i].id == req.params.id) {
            stationToRet = stations[i];
            obsToDel = stations[i].observations;
            if (obsToDel.length > 0) {
                k = 0;
                for (let j=0; j<observations.length; j++) {
                    if (k >= obsToDel.length) {
                        break;
                    }
                    if (observations[j].id == obsToDel[k]){
                        obsToRet.push(observations[j]);
                        observations.splice(j, 1);
                        k++;
                        j--;
                    }
                }
            }
            stations.splice(i, 1)
            res.status(200).json({station: stationToRet, observations: obsToRet});
            return;
        }
    }
    res.status(404).json({'message': "Station with id " + req.params.id + " does not exist."});
});

app.put('/stations/:id', (req, res) => {
    if (req.body === undefined || req.body.description === undefined || req.body.lat === undefined 
        || req.body.lon === undefined || req.body.observations === undefined) { // skoda betur observation id check
        res.status(400).json({'message': "description, latitude and longitude fields are required in the request body"}); 
    } else {
        for (let i=0;i<stations.length;i++) {
            if (stations[i].id == req.params.id) {
                stations[i].description = req.body.description;
                stations[i].lat = req.body.lat;
                stations[i].lon = req.body.lon;
                stations[i].description = req.body.description;
                res.status(201).json(req.body);
                return;
                }
            }
        res.status(404).json({'message': "Station with id " + req.params.id + " does not exist"});
    }
});
/* þessi prentar út observation arrayið fyrir station idið */
app.get('/stations/:id/observations', (req, res) => {
    for (let i=0;i<observations.length;i++) {
        if (stations[i].id == req.params.id) {
            res.status(200).json(observations[i]);
            return;
        }
    }
    res.status(404).json({'message': "Observation with station id " + req.params.id + "does not exist."});
});

/* á eftir að fokka í þessum fyrir "Read an individual observation"*/
app.get('stations/observations/:id', (req, res) => {
    for (let i=0;i<stations.observations.length;i++) {
        if (stations[i].observations == req.params.id) {
            res.status(200).json(stations[i]);
            return;
        }
    }
    res.status(404).json({'message': "Observation with id " + req.params.id + " does not exist."});
});


app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});