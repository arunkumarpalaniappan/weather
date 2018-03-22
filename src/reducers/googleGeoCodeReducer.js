import * as types from '../actions/actionTypes'
import initialState from './initialState'

export default function getGoogleGeoCodeReducer(state = initialState.geoCodeData, action) {
    switch (action.type) {
        case types.GET_GEO_CODE_SUCCESS:
            return action.geoCodeData;
        default:
            return state;
    }
}


