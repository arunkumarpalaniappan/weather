import googleMapsApi from '../api/googleMapsAPI'
import * as types from './actionTypes'

export function loadGooglePlaces(location) {
    return function(dispatch) {
        return googleMapsApi.getGooglePlaces(location).then(places => {
            dispatch(getGooglePlacesSuccess(places));
        }).catch(error => {
            throw(error);
        });
    };
}

export function getGooglePlacesSuccess(locationData) {
    return {type: types.GET_LOCATION_DATA_SUCCESS, locationData}
}