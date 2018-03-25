import React from 'react';
import {Card, Grid, Search, Table} from 'semantic-ui-react'
import {connect} from 'react-redux'
import * as mapActions from '../actions/mapsAction'
import * as openWeatherActions from '../actions/weatherActions'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import '../css/App.css';

const LineChart = require("react-chartjs").Line;

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
                    label: "Humidity in %",
                    fillColor: "rgba(220,220,220,0.2)",
                    strokeColor: "rgba(220,220,220,1)",
                    pointColor: "rgba(220,220,220,1)",
                    pointStrokeColor: "#fff",
                    pointHighlightFill: "#fff",
                    pointHighlightStroke: "rgba(151,187,205,1)",
                    data: []
                },
                {
                    label: "Wind in hpa",
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
            let date = new Date();
            for (let idx = 0; idx < 9; idx++) {
                let tempData = forecastData.list[idx];
                let tempDataLabel = tempData["dt_txt"].replace(date.getFullYear() + '-', '').replace('00:00', '00').split(' ');
                chartData.labels.push(tempDataLabel[1] + ' ' + tempDataLabel[0]);
                chartData.datasets[0].data.push(tempData["main"]["temp"]);
                chartData.datasets[1].data.push(tempData["main"]["humidity"]);
                chartData.datasets[2].data.push(tempData["wind"]["speed"])
            }
            let feedContents = [];
            let processData = _.map(forecastData.list, (data) => {
                data['dt_date'] = data.dt_txt.split(' ')[0];
                return data
            });
            processData = _.groupBy(processData, (data) => data.dt_date);
            for (let key in processData) {
                feedContents.push(<Table.Header key={key}>
                    <Table.Row colSpan={5}>
                        <Table.HeaderCell colSpan={5}>{(new Date(key)).toDateString()}</Table.HeaderCell>
                    </Table.Row>
                </Table.Header>);
                for (let idx = 0; idx < processData[key].length; idx++) {
                    feedContents.push(<Table.Body key={key + '_' + idx}><Table.Row>
                        <Table.Cell rowSpan='3'>
                            {processData[key][idx]['dt_txt'].split(' ')[1].replace(':00:00', ':00')}<br/>
                            <img
                                src={`http://openweathermap.org/img/w/${processData[key][idx]['weather'][0].icon}.png`}
                                alt={''}/>
                        </Table.Cell>
                        <Table.Cell colSpan='2'>
                            <strong>{processData[key][idx].main.temp} &#176; C &nbsp;&&nbsp; {processData[key][idx].weather[0].main}</strong><br/>
                            Humidity: <strong>{processData[key][idx].main.humidity + "%"}</strong><br/>
                            Pressure: <strong>{processData[key][idx].main.pressure}</strong> hpa<br/>
                            Wind
                            Speed: <strong>{this.convertDegreestoDirections(processData[key][idx].wind.deg) + ' (' + processData[key][idx].wind.deg + ') ' + processData[key][idx].wind.speed}</strong> m/s<br/>
                        </Table.Cell>
                    </Table.Row></Table.Body>)
                }
            }
            this.setState({chartData, feedContents})
        }
    };
    convertDegreestoDirections = (deg) => {
        let degConv = ((deg / 22.5) + 0.5);
        const arr = ["North", "North-North East", "North East", "East-North East", "East", "East-South East", "South East", "South-South East", "South", "South-South West", "South West", "West-South West", "West", "West-North West", "North West", "North-North West"];
        return arr[Math.floor(degConv) % 16]
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
                offsetGridLines: false,
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true,
                    labels: {
                        fontColor: "#000080",
                    }
                }
            },
            feedContents: []
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

    componentWillMount() {
        const _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                let browserLocation = {lat: position.coords.latitude, lng: position.coords.longitude};
                _this.processChartData(browserLocation);
            });
        }
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
                  <Grid.Column computer={4} tablet={16} mobile={16}>
                      <Card>
                          <Card.Content>
                              <Card.Header>
                                  <img
                                      src={`http://openweathermap.org/img/w/${this.props.weatherData.weather[0].icon}.png`}
                                      alt={''}/> &nbsp;
                                  {this.props.weatherData.main.temp} &#176; C &nbsp;&&nbsp; {this.props.weatherData.weather[0].main}
                              </Card.Header>
                              <Card.Meta>
                                  {this.state.value.location}
                              </Card.Meta>
                              <Card.Description>
                                  Humidity: <strong>{this.props.weatherData.main.humidity + "%"}</strong><br/>
                                  Pressure: <strong>{this.props.weatherData.main.pressure}</strong> hpa<br/>
                                  Wind
                                  Speed: <strong>{this.convertDegreestoDirections(this.props.weatherData.wind.deg) + ' (' + this.props.weatherData.wind.deg + ') ' + this.props.weatherData.wind.speed}</strong> m/s<br/>
                                  Minimum
                                  Temperature: <strong>{this.props.weatherData.main.temp_min} &#176; C</strong><br/>
                                  Maximum
                                  Temperature: <strong>{this.props.weatherData.main.temp_max} &#176; C</strong><br/>
                                  Sun
                                  Rise: <strong>{(new Date(this.props.weatherData.sys.sunrise * 1000)).toString()}</strong><br/>
                                  Sun
                                  Set: <strong>{(new Date(this.props.weatherData.sys.sunset * 1000)).toString()}</strong><br/>
                              </Card.Description>
                          </Card.Content>
                      </Card>
                  </Grid.Column>
                  <Grid.Column computer={12} tablet={16} mobile={16}>
            
                      {(this.state.chartData.datasets) ? (
                          <div>
                              <div>
                                  <LineChart data={this.state.chartData} options={this.state.chartOptions} width="800"
                                             height="275"/><br/>
                              </div>
                              <div>
                                  <Table celled>
                                      {this.state.feedContents}
                                  </Table>
                              </div>
                          </div>
                      ) : null}
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
