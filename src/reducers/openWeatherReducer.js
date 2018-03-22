import * as types from '../actions/actionTypes'
import initialState from './initialState'

export default function getWeatherReducer(state = initialState.weatherData, action) {
    switch (action.type) {
        case types.GET_WEATHER_SUCCESS:
            return action.weatherData;
        default:
            return state;
    }
}


