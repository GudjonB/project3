

module.exports.isValidNumber = function (param){
    if ((Number)(param) != NaN && param != undefined){
        return true;
    }
    else {
        return false;
    }
}

module.exports.isValidLat = function (lat){
    if(isValidNumber(lat) && lat > -90 && lat < 90){
        return true;
    }
    else {
        return false;
    }
}
module.exports.isValidLon = function (lon){
    if(isValidNumber(lon) && lon > -180 && lon < 180){
        return true;
    }
    else {
        return false;
    }
}

function isValidPrec(prec){
    if(isValidNumber(prec) && prec >= 0){
        return true;
    }
    else {
        return false;
    }
}

function isValidHum(hum){
    if(isValidNumber(hum) && hum >= 0 && hum <= 100){
        return true;
    }
    else {
        return false;
    }
}

module.exports.isValidObservation = function(observation){
    if( observation != undefined && isValidNumber(observation.temp) && isValidHum(observation.hum) && isValidNumber(observation.windSpeed)
       && isValidNumber(observation.windDir) && isValidPrec(observation.prec)){
           return true;
       }
       else {
           return false;
       }
}

module.exports.isValidStation = function(station){
    if(station != undefined && isValidLat(station.lat) && isValidLon(station.lon) && station.description != undefined && typeof(station.windDir) != String){
        return true;
    }
    else {
        return false;
    }
}