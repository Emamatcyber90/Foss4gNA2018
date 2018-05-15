import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';
import pageOne from '../../img/BoundlessLogo2018.png';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';

const store = createStore(combineReducers({'map': SdkMapReducer}));

export default class ZoomWith extends Component {
  componentDidMount() {
    store.dispatch(SdkMapActions.setView([-90, 38], 7));

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
        <header><h3>Map with Zoom</h3></header>
        <content>
          <div className="left skinny">
            <h6>Now a user regardless of platform can zoom in and out</h6>
          </div>
          <div className="right fat">
            <map>
              <Provider store={store}>
                <SdkMap store={store} >
                  <SdkZoomControl />
                </SdkMap>
              </Provider>
            </map>
            <div className="caption">
              You need a Zoom
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
