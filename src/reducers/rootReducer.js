import {combineReducers} from 'redux'
import locationData from './googlePlacesReducer'
import geoCodeData from './googleGeoCodeReducer'
import weatherData from './openWeatherReducer'
import forecastData from './openForecastReducer'

const rootReducer = combineReducers({
    locationData,
    geoCodeData,
    weatherData,
    forecastData
});

export default rootReducer

