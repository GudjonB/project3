

function isValidNumber(param){
    if ((Number)(param) != NaN && param != undefined){
        return true;
    }
    else {
        return false;
    }
}

function isValidLat(lat){
    if(isValidNumber(lat) && lat > -90 && lat < 90){
        return true;
    }
    else {
        return false;
    }
}
function isValidLon(lon){
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

module.exports.isValidObservation = function (observation){
    if(isValidNumber(observation.temp) && isValidHum(observation.hum) && isValidNumber(observation.windSpeed)
       && isValidNumber(observation.windDir) && isValidPrec(observation.prec)){
           return true;
       }
       else {
           return false;
       }
}