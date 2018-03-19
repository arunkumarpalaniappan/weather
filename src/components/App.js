import React from 'react';
import { Input } from 'semantic-ui-react'
import {connect} from 'react-redux'
import * as mapActions from '../actions/mapsAction'
import {bindActionCreators} from 'redux'
import '../css/App.css';

class App extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
          isLoading: false
      };
      this.showRecommendations = this.showRecommendations.bind(this);
  }
    showRecommendations(event) {
        let location = event.target.value;
        if(location.length) {
            this.setState({isLoading:true})
            this.props.actions.loadGooglePlaces(location).then(res => {
                console.log(res)
            })
        } else {
            this.setState({isLoading:false})
        }
    }
  render() {
    return (
      <div className="weather-div">
          <Input
              fluid
              loading={this.state.isLoading}
              icon='location arrow'
              iconPosition='left'
              placeholder='Enter your location'
              onChange={this.showRecommendations}
              size='medium' />
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
