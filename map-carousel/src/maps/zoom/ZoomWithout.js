import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';

const store = createStore(combineReducers({'map': SdkMapReducer}));

export default class ZoomWithout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
  componentDidMount() {
    store.dispatch(SdkMapActions.setView([-90.1911121, 38.6251834], 10));
    store.dispatch(SdkMapActions.addSource('mblight', {
      type: 'raster',
      tileSize: 256,
      tiles: [
        'https://bcs.boundlessgeo.io/basemaps/mapbox/light/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
      ]
    }));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'mblight',
    }));
  }
  render() {
    return (
      <div className="slideContent">
        <header><h3>Simple first map</h3></header>
        <content>
          <div className="left skinny">
            <h6>Find a problem get some swag</h6>
            <button className="sdk-btn right" onClick={()=>this.setState({show: true})}>show</button>
            {this.state.show ? <p>Zoom Buttons</p> : false}
          </div>
          <div className="right fat">
            <map>
              <Provider store={store}>
                <SdkMap store={store} >
                </SdkMap>
              </Provider>
            </map>
            <div className="caption">
            </div>
          </div>
        </content>
        <footer>
          <img src={pageOne} alt='Boundless Geospacial' height="34"></img>
        </footer>
      </div>
    );
  }
}
