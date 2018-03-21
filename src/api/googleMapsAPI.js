import Promise from "bluebird"

class googleMapsApi {
    static getGooglePlaces(value) {
        const autoCompleteService = new window.google.maps.places.AutocompleteService();
        return new Promise(function (resolve, reject) {
            autoCompleteService.getPlacePredictions(
                {
                    types: ["(regions)"],
                    input: value,
                }, (predictions, status) => {
                    if (status === "OK") {
                        resolve(predictions);
                    } else {
                        reject(status);
                    }
                }
            );
        });
    }

    static getGeoCode(value) {
        const geocoder = new window.google.maps.Geocoder();
        return new Promise(function (resolve, reject) {
            geocoder.geocode({'address': value}, function (results, status) {
                if (status === 'OK') {
                    const location = {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng()
                    };
                    resolve(location);
                } else {
                    reject(status);
                }
            });
        });
    }
}
export default googleMapsApi;