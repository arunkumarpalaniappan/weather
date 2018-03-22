class openWeatherMap {
    static getWeather(location) {
        return fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${location.lat}&lon=${location.lng}&APPID=df0e6a35ea24a42b71dd2a0ee562ced3`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                return json
            }).catch(function (ex) {
                console.log('parsing failed', ex);
                return ex
            })
    }

    static getForecast(location) {
        return fetch(`http://api.openweathermap.org/data/2.5/forecast?lat=${location.lat}&lon=${location.lng}&APPID=df0e6a35ea24a42b71dd2a0ee562ced3`)
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                return json
            }).catch(function (ex) {
                console.log('parsing failed', ex);
                return ex
            })
    }
}

export default openWeatherMap;