import 'whatwg-fetch'

class googleMapsApi {
    static getGooglePlaces(locString) {
        return fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + locString + '&types=geocode&key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo')
            .then(function (response) {
                return response.json()
            }).then(function (json) {
                console.log('parsed json', json);
                return json
            }).catch(function (ex) {
                console.log('parsing failed', ex);
                return ex
            })
        // return fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input=' + locString + '&types=geocode&key=AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo', {
        //     method: 'GET',
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Access-Control-Allow-Origin':'*',
        //         'Access-Control-Allow-Credentials': true,
        //         'Access-Control-Allow-Methods': 'GET'
        //     }
        // }).then(response => {
        //     if (response.ok) {
        //         response.json().then(json => {
        //             return json
        //         });
        //     }
        //     return null
        // })
        //     .catch(error => {
        //         console.log(error);
        //         return error;
        //     });
    }
}


export default googleMapsApi;