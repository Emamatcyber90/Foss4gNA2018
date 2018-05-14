import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';

import STL_PARKS from '../../data/stl_parks.json';
const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

export default class MAP extends Component {
  componentDidMount() {
    // add the OSM source
    store.dispatch(SdkMapActions.addOsmSource('osm'));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
    // Start with a reasonable global view of hte map.
    store.dispatch(SdkMapActions.setView([-90.1911121, 38.6251834], 10));
    store.dispatch(SdkMapActions.addSource('park', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'random-points',
      source: 'park',
      type: 'fill',
      'paint': {
        'fill-color': '#00ffff'
      }
    }));

    store.dispatch(SdkMapActions.updateMetadata({
      'mapbox:groups': {
        base: {
          name: 'Base Maps',
        },
      },
    }));
    // Background layers change the background color of
    // the map. They are not attached to a source.
    store.dispatch(SdkMapActions.addLayer({
      id: 'background',
      type: 'background',
      paint: {
        'background-color': '#eee',
      },
      metadata: {
        'bnd:hide-layerlist': true,
      },
    }));
    this.quickAddPoint(STL_PARKS);
  }
  quickAddPoint(json) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      store.dispatch(SdkMapActions.addFeatures('park', [{
        type: 'Feature',
        properties: {name: feature.properties.name},
        geometry: feature.geometry,
      }]));
    }
  }
  render() {
    return (
      <div  className="slideContent">
        <content>
          <div className="left skinny">Big Icons</div>
          <div className="right fat">
            <h3>title</h3>
            <map>
              <Provider store={store}>
                <SdkMap store={store} />
              </Provider>
            </map>
            <div className="caption">
              caption here
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
