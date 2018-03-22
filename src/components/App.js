import React from 'react';
import {Card, Grid, Search} from 'semantic-ui-react'
import {connect} from 'react-redux'
import * as mapActions from '../actions/mapsAction'
import * as openWeatherActions from '../actions/weatherActions'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import '../css/App.css';

const LineChart = require("react-chartjs").Line;
//const API_KEY = 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo';

class App extends React.Component {
    processChartData = (forecastData) => {
        const chartData = {
            labels: [],
            datasets: [
                {
                    label: "Temperature in Celsius",
                    fillColor: "rgba(151,187,205,0.2)",
                    strokeColor: "rgba(151,187,205,1)",
                    pointColor: "rgba(151,187,205,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(220,220,220,1)",
                    data: []
                },
                {
                    label: "Humidity",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                },
                {
                    label: "Wind in SI",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                }
            ]
        };
        if (forecastData.list) {
            for (var idx = 0; idx < 9; idx++) {
                var tempData = forecastData.list[idx];
                chartData.labels.push(tempData["dt_txt"]);
                chartData.datasets[0].data.push(tempData["main"]["temp"]);
                chartData.datasets[1].data.push(tempData["main"]["humidity"]);
                chartData.datasets[2].data.push(tempData["wind"]["speed"])
            }
            this.setState({chartData})
        }
    };

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
    convertDegreestoDirections = (deg) => {
        let degConv = ((deg / 22.5) + 0.5);
        const arr = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
        return arr[Math.floor(degConv) % 16]
    };

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            results: [],
            value: {},
            chartData: {},
            chartOptions: {
                scaleShowGridLines: true,
                scaleGridLineColor: "rgba(0,0,0,.05)",
                scaleGridLineWidth: 1,
                scaleShowHorizontalLines: true,
                scaleShowVerticalLines: true,
                bezierCurve: true,
                bezierCurveTension: 0.4,
                pointDot: true,
                pointDotRadius: 4,
                pointDotStrokeWidth: 1,
                pointHitDetectionRadius: 20,
                datasetStroke: true,
                datasetStrokeWidth: 2,
                datasetFill: true,
                offsetGridLines: false
            }
        };
    }

    componentWillReceiveProps(nextProps) {
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
            } else {
                if (nextProps.weatherData.cod && nextProps.forecastData.cod && nextProps.forecastData.list) {
                    this.processChartData(nextProps.forecastData);
                }
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
          /><br/>
          {this.props.weatherData.main ? (
              <Grid>
                  <Grid.Column width={4}>
                      <Card>
                          <Card.Content>
                              <Card.Header>
                                  {this.props.weatherData.main.temp} &#176; C &nbsp;&&nbsp; {this.props.weatherData.weather[0].main}
                              </Card.Header>
                              <Card.Meta>
                                  {this.state.value.location}
                              </Card.Meta>
                              <Card.Description>
                                  Humidity: <strong>{this.props.weatherData.main.humidity}</strong><br/>
                                  Pressure: <strong>{this.props.weatherData.main.pressure}</strong> SI<br/>
                                  Wind
                                  Speed: <strong>{this.convertDegreestoDirections(this.props.weatherData.wind.deg) + ' ' + this.props.weatherData.wind.speed}</strong> kph<br/>
                                  Minimum
                                  Temperature: <strong>{this.props.weatherData.main.temp_min} &#176; C</strong><br/>
                                  Maximum
                                  Temperature: <strong>{this.props.weatherData.main.temp_max} &#176; C</strong><br/>
                              </Card.Description>
                          </Card.Content>
                      </Card>
                  </Grid.Column>
                  <Grid.Column width={12}>
                      {(this.state.chartData.datasets) ? (
                          <LineChart data={this.state.chartData} options={this.state.chartOptions} width="800"
                                     height="300"/>) : null}
                  </Grid.Column>
              </Grid>) : null}
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
