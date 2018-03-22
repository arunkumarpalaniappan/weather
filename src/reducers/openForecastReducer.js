import * as types from '../actions/actionTypes'
import initialState from './initialState'

export default function getWeatherReducer(state = initialState.forecastData, action) {
    switch (action.type) {
        case types.GET_FORECAST_SUCCESS:
            return action.forecastData;
        default:
            return state;
    }
}


