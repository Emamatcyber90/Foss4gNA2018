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

export default class LayerWith extends Component {
  componentDidMount() {
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
      <Provider store={store}>
        <SdkMap store={store} >
          <SdkZoomControl />
        </SdkMap>
      </Provider>
    );
  }
}
