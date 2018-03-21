import {combineReducers} from 'redux'
import locationData from './googlePlacesReducer'
import geoCodeData from './googleGeoCodeReducer'

const rootReducer = combineReducers({
    locationData,
    geoCodeData
});

export default rootReducer

