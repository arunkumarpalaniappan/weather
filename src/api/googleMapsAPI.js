class googleMapsApi {
    static getGooglePlaces(locString) {
        return fetch('https://maps.googleapis.com/maps/api/place/autocomplete/json?input='+locString+'&types=geocode&key=AIzaSyB-4Q__JV3vhlTSAaITDDQaUWep59nYu40', {
            method: 'GET',
            mode: 'cors' ,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials': true
            }
        }).then(response => {
            if (response.ok) {
                response.json().then(json => {
                    console.log(json);
                    return json
                });
            }
            return null
        })
            .catch(error => {
                console.log(error)
                return error;
            });
    }
}


export default googleMapsApi;