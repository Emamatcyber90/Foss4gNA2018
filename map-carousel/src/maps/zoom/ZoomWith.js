import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

export default class ZoomWith extends Component {
  componentDidMount() {
    store.dispatch(SdkMapActions.setView([-90, 38], 7));

    // add the OSM source
    store.dispatch(SdkMapActions.addOsmSource('osm'));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
  }
  render() {
    return (
      <div className="slideContent">
        <content>
          <div className="left skinny"></div>
          <div className="right fat">
            <h3>Map with Zoom</h3>
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
          FOOTER HERE
        </footer>
      </div>
    );
  }
}
