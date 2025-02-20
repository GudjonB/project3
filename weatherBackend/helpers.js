

function isValidNumber(param) { // this function checks if the parametaer converted to a number is stilla valid number
    if (!isNaN((Number)(param)) && param != undefined) { // if it is defined
        return true;
    }
    else {
        return false;
    }
}

module.exports.isValidNumber = function (param){
    return isValidNumber(param);
}

function isValidLat (lat){
    if(isValidNumber(lat) && lat >= -90 && lat <= 90){
        return true;
    }
    else {
        return false;
    }
}
function isValidLon (lon){
    if(isValidNumber(lon) && lon >= -180 && lon <= 180){
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
function isValidDescription(description){   // validations for strings was not required, but we still check to see if thay are strings
    if(description != undefined && typeof(description) === 'string'){
        return true;
    }
    else {
        return false;
    }
}
function isValidWindDir(windDir){
    if(windDir != undefined && typeof(windDir) === 'string'){
        return true;
    }
    else {
        return false;
    }
}

module.exports.isValidObservation = function(observation){ // wrapper for validating a whole observation exported
    if( observation != undefined && isValidNumber(observation.temp) && isValidHum(observation.hum) && isValidNumber(observation.windSpeed)
       && isValidWindDir(observation.windDir) && isValidPrec(observation.prec) && isValidNumber(observation.windSpeed)){
           return true;
       }
       else {
           return false;
       }
}

module.exports.isValidStation = function(station){ // wrapper for validating a whole station exported
    if(station != undefined && isValidLat(station.lat) && isValidLon(station.lon) && isValidDescription(station.description)){
        return true;
    }
    else {
        return false;
    }
}