//Sample data for Project 3
const express = require('express');
const app = express(); /* Þarf þennan ? */
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser'); /* bodyparsed? */

function unixTimeStamp() {
    var date = new Date();
    return date.getTime();
}
//The following is an example of an array of two stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [

    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [1,2]},
    {id: 2, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1]},
    {id: 3, description: "Egilsstadir", lat: 65.6856, lon: 18.1002, observations: [4,5]}
];

//The following is an example of an array of two observations.
//Note that an observation does not know which station it belongs to!
var observations = [
    {id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0},
    {id: 2, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
    {id: 3, date: 1551885137409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
    {id: 4, date: 1551842337409, temp: 0.6, windSpeed: 5.0, windDir: "n", prec: 0.0, hum: 50.0},
    {id: 5, date: 1551842337409, temp: 29.6, windSpeed: 5.0, windDir: "s", prec: 0.0, hum: 50.0}

];


let nextStationId = 4;
let nextObservationId = 6;

app.use(bodyParser.json()); /* Tell express to use the body parser module */

// Read all stations
app.get('/stations', (req, res) => {
    if (stations.length > 0) {
        let stationPart = [];
        let i = 0;
        while (i < stations.length) {
            part = {id:stations[i].id, description: stations[i].description};
            stationPart.push(part);
            i++
        }
        res.status(200).json({Stations:stationPart});
        return;
    }
    res.status(404).json({'message': "No stations exist."});
});

// Read an individual station
app.get('/stations/:id', (req, res) => {
    let i = 0;
    while (i < stations.length) {
        let j = 0;
        let k = 0;
        if(stations[i].id = req.params.id) {
            /* If all observations should appear within the station in the observations attribute the following code should be used
            let tmpObs = stations[i].observations.slice();
            while (j < stations[i].observations.length && k < observations.length) {
                if (observations[k].id == stations[i].observations[j]) {
                    stations[i].observations[j] = observations[k];
                    j++;
                    k++;
                } else {
                    k++;
                }
            }*/
            res.status(200).json(stations[i]);
            //stations[i].observations = tmpObs; 
            return;
        }
        i++;
    }
    res.status(404).json({'message': "Station with id " + req.params.id + " does not exist."});
    return;
    
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

// Delete all stations
app.delete('/stations', (req, res) => {
    if (stations.length == 0) {
        res.status(400).json({'message': "There are no stations to delete"});
        return;
    }

    let i = 0;
    while (i < stations.length) {
        let j = 0;
        let k = 0;
        while (j < stations[i].observations.length && k < observations.length) {
            if (observations[k].id == stations[i].observations[j]) {
                stations[i].observations[j] = observations[k];
                j++;
                k++;
            } else {
                k++;
            }
        }
        i++;
    }
    res.status(200).json(stations);
    stations = [];
    observations = [];
    return;
});

// delete a single stations and all of its observations
app.delete('/stations/:id', (req, res) => {
    let i = 0;
    while (i < stations.length) {
        let j = 0;
        let k = 0;
        if(stations[i].id == req.params.id) {
            while (j < stations[i].observations.length && k < observations.length) {
                if (observations[k].id == stations[i].observations[j]) {
                    stations[i].observations[j] = observations[k];
                    observations.splice(k, 1);
                    j++;
                } else {
                    k++;
                }
            }
            res.status(200).json(stations[i]);
            stations.splice(i, 1);
            return;
        }
        i++;
    }
    res.status(404).json({'message': "Station with id " + req.params.id + " does not exist."});
    return;
    
});

app.put('/stations/:id', (req, res) => {
    if (req.body === undefined || req.body.description === undefined || req.body.lat === undefined 
        || req.body.lon === undefined ) { // skoda betur observation id check
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
    for (let i = 0; i < stations.length; i++) {
        if (stations[i].id == req.params.id) {
            let obsToRet = [];
            for(let j = 0; j < stations[i].observations.length; j++){
                for(let k = 0; k < observations.length; k++){
                    if(observations[k].id == stations[i].observations[j]){
                        obsToRet.push(observations[k]);
                    }
                }
            }
            res.status(200).json(obsToRet);
            return; 
        }
    }
    res.status(404).json({'message': "Observation with station id " + req.params.id + " does not exist."});
    return;
});

/* á eftir að fokka í þessum fyrir "Read an individual observation"*/
app.get('/stations/:sId/observations/:oId', (req, res) => {
    for(let i = 0; i < stations.length; i++){
        if(stations[i].id == req.params.sId){
            for (let j = 0 ; j < stations[i].observations.length; j++) {
                if (stations[i].observations[j] == req.params.oId) {
                    for(let k = 0; k < observations.length; k++){
                        if(observations[k].id == stations[i].observations[j]){
                            res.status(200).json(observations[k]);
                            return;
                        }
                    }
                }
            }
        }
    } 
    res.status(404).json({'message': "Observation with id " + req.params.oId + " for station with id "+ req.params.sId +" does not exist."});
});
// Create a new observation
app.post('/stations/:id/observations', (req, res) => {
    if (req.body.temp === undefined || req.body.windSpeed === undefined || req.body.windDir === undefined
        || req.body.prec === undefined || req.body.hum === undefined) {
            console.log(req.body);
        res.status(400).json({ 'message': "temp, windSpeed, windDir, prec and hum fields are required in the request body" });
    } else {
        for (let i = 0; i < stations.length; i++) {
            if (stations[i].id == req.params.id) {
                let newObservation = { 
                    id:        nextObservationId,
                    date:      new Date().getTime(),
                    temp:      req.body.temp,
                    windSpeed: req.body.windSpeed,
                    windDir:   req.body.windDir,
                    prec:      req.body.prec,
                    hum:       req.body.hum};
                observations.push(newObservation);
                stations[i].observations.push(newObservation.id);
                nextObservationId++;
                res.status(201).json(newObservation);
                return;
            }
        }
        res.status(404).json({ 'message': "Station with id " + req.params.id + " does not exist" });
    }
});
//id: 1, date: 1551885104266, temp: -2.7, windSpeed: 2.0, windDir: "ese", prec: 0.0, hum: 82.0


app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});

app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});