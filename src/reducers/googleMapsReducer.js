import * as types from '../actions/actionTypes'
import initialState from './initialState'

export default function getGoogleMapsReducer(state = initialState.locationData, action) {
    switch(action.type) {
        case types.GET_LOCATION_DATA_SUCCESS:
            return action.locationData;
        default:
            return state;
    }
}
