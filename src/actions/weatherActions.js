import openWeatherMap from '../api/openWeatherMapAPI'
import * as types from './actionTypes'

export function getWeather(location) {
    return function (dispatch) {
        openWeatherMap.getWeather(location).then(weather => {
            dispatch(getWeatherSuccess(weather))
        }).catch(error => {
            throw(error);
        });
    }
}

export function getForecast(location) {
    return function (dispatch) {
        openWeatherMap.getForecast(location).then(forecast => {
            dispatch(getForecastSuccess(forecast))
        }).catch(error => {
            throw(error)
        });
    }
}

export function getWeatherSuccess(weatherData) {
    return {type: types.GET_WEATHER_SUCCESS, weatherData}
}

export function getForecastSuccess(forecastData) {
    return {type: types.GET_FORECAST_SUCCESS, forecastData}
}