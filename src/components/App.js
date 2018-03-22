import React from 'react';
import {Search} from 'semantic-ui-react'
import {connect} from 'react-redux'
import * as mapActions from '../actions/mapsAction'
import * as openWeatherActions from '../actions/weatherActions'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import '../css/App.css';

//const API_KEY = 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          isLoading: false,
          results: [],
          value: {}
      };
  }

    handleResultSelect = (e, {result}) => {
        this.setState({value: result});
        this.props.actions.getGeoCode(result.location);
    };
    handleSearchChange = (e, {value}) => {
        if (value.length) {
            this.setState({isLoading: true});
            this.props.actions.loadGooglePlaces(value);
        }
    };

    componentWillReceiveProps(nextProps) {
        console.log(nextProps);
        let results = nextProps.locationData.map((data, idx) => ({
            title: data.structured_formatting.main_text,
            place_id: data.place_id,
            description: data.structured_formatting.secondary_text,
            key: idx,
            location: data.description
        }));
        if (nextProps.geoCodeData.lat) {
            if (nextProps.geoCodeData.lat !== this.props.geoCodeData.lat && nextProps.geoCodeData.lng !== this.props.geoCodeData.lng) {
                this.props.actions.getWeather(nextProps.geoCodeData);
                this.props.actions.getForecast(nextProps.geoCodeData);
            }
        }
        this.setState({isLoading: false, results})
    }
  render() {
    return (
      <div className="weather-div">
          <Search
              fluid
              loading={this.state.isLoading}
              onResultSelect={this.handleResultSelect}
              onSearchChange={_.debounce(this.handleSearchChange, 1000, {leading: true})}
              results={this.state.results}
              value={this.state.valuevalue}
              placeholder={"Enter your location"}
          />
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        locationData: state.locationData,
        geoCodeData: state.geoCodeData,
        weatherData: state.weatherData,
        forecastData: state.forecastData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Object.assign({}, mapActions, openWeatherActions), dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
