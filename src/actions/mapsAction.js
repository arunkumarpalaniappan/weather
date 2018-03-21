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

export function getGeoCode(location) {
    return function (dispatch) {
        return googleMapsApi.getGeoCode(location).then(geoCode => {
            dispatch(getGeoCodeSuccess(geoCode))
        }).catch(error => {
            throw(error);
        });
    };
}
export function getGooglePlacesSuccess(locationData) {
    return {type: types.GET_LOCATION_DATA_SUCCESS, locationData}
}

export function getGeoCodeSuccess(geoCodeData) {
    return {type: types.GET_GEO_CODE_SUCCESS, geoCodeData}
}