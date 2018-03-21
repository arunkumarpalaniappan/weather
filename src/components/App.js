import React from 'react';
import {Search} from 'semantic-ui-react'
import {connect} from 'react-redux'
import * as mapActions from '../actions/mapsAction'
import _ from 'lodash'
import {bindActionCreators} from 'redux'
import '../css/App.css';

//const API_KEY = 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo';

class App extends React.Component {
    handleResultSelect = (e, {result}) => this.setState({value: result});
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
          value: {}
      };
  }

    componentWillReceiveProps(nextProps) {
        let results = nextProps.locationData.map((data, idx) => ({
            title: data.structured_formatting.main_text,
            place_id: data.place_id,
            description: data.structured_formatting.secondary_text,
            ke: idx
        }));
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

function mapStateToProps(state, ownProps) {
    return {
        locationData: state.locationData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(mapActions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
