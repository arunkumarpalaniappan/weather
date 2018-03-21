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
}
export default googleMapsApi;