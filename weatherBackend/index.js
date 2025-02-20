//Initialization of the server and needed helper functions
const express = require('express');
var helpers = require('./helpers.js')
const app = express();
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

//The following is an example of an array of stations. 
//The observation array includes the ids of the observations belonging to the specified station
var stations = [

    {id: 1, description: "Reykjavik", lat: 64.1275, lon: 21.9028, observations: [1,2]},
    {id: 2, description: "Akureyri", lat: 65.6856, lon: 18.1002, observations: [1]},
    {id: 3, description: "Egilsstadir", lat: 65.6856, lon: 18.1002, observations: [4,5]}
];

//The following is an example of an array of observations.
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
app.get('/api/v1/stations', (req, res) => {
    let retArr = [];
    let i = 0;
    // Iterate through the array and push the id and description to a new return array
    while (i < stations.length) {
        part = {id:stations[i].id, description: stations[i].description};
        retArr.push(part);
        i++
    }
    res.status(200).json({Stations:retArr});
    return;
});

// Read an individual station
app.get('/api/v1/stations/:id', (req, res) => {
    let i = 0;
    // Iterate through all the stations
    while (i < stations.length) {
        // If the stations ID matches the requested ID return that station
        if(stations[i].id == req.params.id) {
            res.status(200).json(stations[i]);
            return;
        }
        i++;
    }
    // If the station is not found return error message
    res.status(404).json({'message': "Station with id: " + req.params.id + " does not exist."});
    return;
    
});

// Create a new station
app.post('/api/v1/stations', (req, res) => {
    // The input is validated and if not okay error message is sent and status code 400
    if (!helpers.isValidStation(req.body)) {
        res.status(400).json({'message': "Valid description, latitude and longitude fields are required in the request body"});
        // If everything is valid, a new station is made and status code 201 is sent
    } else {
        let newStation = {
            id:nextStationId,
             description: req.body.description,
                     lat: (Number)(req.body.lat),
                     lon: (Number)(req.body.lon), 
            observations: []};
        stations.push(newStation);
        nextStationId++;
        res.status(201).json(newStation);
    }
});

// Delete all stations
app.delete('/api/v1/stations', (req, res) => {
    // If there are no stations to delete, an error message is sent
    if (stations.length == 0) {
        res.status(404).json({'message': "There are no stations to delete"});
        return;
    }
    // Iterate through all stations
    let i = 0;
    while (i < stations.length) {
        let j = 0;
        let k = 0;
        //For each station find the corresponding observations and store them
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
    // Return all the deleted items
    res.status(200).json(stations);
    stations = [];
    observations = [];
    return;
});

// delete a single stations and all of its observations
app.delete('/api/v1/stations/:id', (req, res) => {
    let i = 0;
    // Iterate through all the stations and find the correct one
    while (i < stations.length) {
        let j = 0;
        let k = 0;
        if(stations[i].id == req.params.id) {
            // For that staion iterate through all of its observations and delete them
            while (j < stations[i].observations.length && k < observations.length) {
                if (observations[k].id == stations[i].observations[j]) {
                    stations[i].observations[j] = observations[k];
                    observations.splice(k, 1);
                    j++;
                } else {
                    k++;
                }
            }
            //Return the deleted stations
            res.status(200).json(stations[i]);
            stations.splice(i, 1);
            return;
        }
        i++;
    }
    // If no stations is with the requested ID an error message is sent with status code 404
    res.status(404).json({'message': "Station with id: " + req.params.id + " does not exist."});
    return;
    
});

/* updating a station */
app.put('/api/v1/stations/:id', (req, res) => {
    if (!helpers.isValidStation(req.body)) { // validation in helpers
        res.status(400).json({'message': "Valid description, latitude and longitude fields are required in the request body"}); 
    } else {
        for (let i=0;i<stations.length;i++) {                   // finding the right station from the given id
            if (stations[i].id == req.params.id) {              //  
                stations[i].description = req.body.description; // all parameters have been validated above
                stations[i].lat = (Number)(req.body.lat);       // number input converted to numbers for consistency
                stations[i].lon = (Number)(req.body.lon);
                stations[i].description = req.body.description;
                res.status(201).json(req.body);
                return;
                }
            }
        res.status(404).json({'message': "Station with id: " + req.params.id + " does not exist"});
    }
});
/* þessi prentar út observation arrayið fyrir station idið */
app.get('/api/v1/stations/:id/observations', (req, res) => {
    for (let i = 0; i < stations.length; i++) {                             //finding the station
        if (stations[i].id == req.params.id) {
            let obsToRet = [];                                              // new array of observations to return created
            for(let j = 0; j < stations[i].observations.length; j++){       // looping through the stations observation array
                for(let k = 0; k < observations.length; k++){               // for every listed observation in the station
                    if(observations[k].id == stations[i].observations[j]){  // find the observation in the observation array
                        obsToRet.push(observations[k]);                     // and push it to the return array
                    }
                }
            }
            res.status(200).json(obsToRet);
            return; 
        }
    }
    res.status(404).json({'message': "Observations for station with id: " + req.params.id + " do not exist."});
    return;
});

/* Read an individual observation*/
app.get('/api/v1/stations/:sId/observations/:oId', (req, res) => {
    for(let i = 0; i < stations.length; i++){                                   //finding the station
        if(stations[i].id == req.params.sId){                                   //
            for (let j = 0 ; j < stations[i].observations.length; j++) {        // looping through the stations observation array
                if (stations[i].observations[j] == req.params.oId) {            // if the statiion array includes the observation asked for
                    for(let k = 0; k < observations.length; k++){               // find the observation in the observation array
                        if(observations[k].id == stations[i].observations[j]){
                            res.status(200).json(observations[k]);
                            return;
                        }
                    }
                }
            }
        }
    } 
    res.status(404).json({'message': "Observation with id: " + req.params.oId + " for station with id: "+ req.params.sId +" does not exist."});
});

// Create a new observation
app.post('/api/v1/stations/:id/observations', (req, res) => {
    if (!helpers.isValidObservation(req.body)) {  // Validation function in helpers used
        res.status(400).json({ 'message': "Valid temp, windSpeed, windDir, prec and hum fields are required in the request body" }); // if the body wasn't valid 
    } else {
        for (let i = 0; i < stations.length; i++) { // first loop through the stations and find the right one
            if (stations[i].id == req.params.id) {
                let newObservation = {              // create a new observation
                    id:        nextObservationId,   // auto generate id
                    date:      new Date().getTime(),// auto generated time 
                    temp:      (Number)(req.body.temp),     // number inputs converted to number for consistency
                    windSpeed: (Number)(req.body.windSpeed),
                    windDir:   req.body.windDir,            // string input already checked in the above validation
                    prec:      (Number)(req.body.prec),
                    hum:       (Number)(req.body.hum)};
                observations.push(newObservation);      // add the new observation to the array
                stations[i].observations.push(newObservation.id); // id of the new observation added to the array of the station
                nextObservationId++;                    // observation id incramented
                res.status(201).json(newObservation);
                return;
            }
        }
        res.status(404).json({ 'message': "Station with id: " + req.params.id + " does not exist" }); // if we got here then no station was found
    }
});

/* Deletes an existing observation for a specified station. The request, if successful, returns all attributes of the deleted observation. */
app.delete('/api/v1/stations/:sId/observations/:oId', (req, res) => {
    for (let i=0;i<observations.length;i++) {           /* loop through the whole observations list */
        if (observations[i].id == req.params.oId) {     /* if we find a match we go here, else we return 404 below */
            var retArr = [];                            /* initialize an array for return */
            retArr.push(observations[i]);               /* push into that array to see what is being deleted, later return */
            observations.slice(i,1);                    /* slice the information to remove */
            res.status(200).json(retArr);               /* return with status 200 the array of which was deleted */
            observations[i].id = [];                    /* clear the valid array*/
            return;                                     
        }
    }
    res.status(404).json({'message': "Observation with id: " + req.params.oId + " does not exist"}); /* if observation with id is not found we return status 404 and a message */
});
/* Deletes all existing observations for a specified station. The request, if successful, returns all deleted observations, and all their attributes. */
app.delete('/api/v1/stations/:id/observations', (req, res) => {
    var retArr = [];
    for (let i=0;i<observations.length;i++) {       /* loop through the whole observations list */
        if (stations[i].id == req.params.id) {      /* if we find a station id equal to the parameters inserted we go here */
            if(stations[i].observations === []){    /* if no observation is listed in the found station we go here */
                res.status(404).json({'message': "Station with id " + req.params.id + " has no observations"}); /* and return 404 with this message */
            }
            for(let j = 0; j < stations[i].observations.length; j++){   /* loop through the stations of observations list */
                for(let k = 0; k < observations.length; k++){           
                    if(observations[k].id == stations[i].observations[j]){   /* if observation with a specific id is equal to an observation listed in valid station we go here */
                        retArr.push(observations.splice(k,1))                /* and push the spliced observations in order to return their values */
                    }
                } 
            }
            res.status(200).json(retArr);   /* return status 200 with the returned array values */
            stations[i].observations = [];  /* clear the valid array */
            return;
        }
        
    }
    res.status(404).json({'message': "Station with id " + req.params.id + " does not exist"}); /* if station with id is not found we return status 404 and a message */
});
/* By default: Not supported */
app.use('*', (req, res) => {
    res.status(405).send('Operation not supported.');
});
/* Express used to listen to port 3000 (defined at top) */
app.listen(port, () => {
    console.log('Express app listening on port ' + port);
});