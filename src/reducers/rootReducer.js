import {combineReducers} from 'redux'
import locationData from './googleMapsReducer'

const rootReducer = combineReducers({
    locationData
});

export default rootReducer

