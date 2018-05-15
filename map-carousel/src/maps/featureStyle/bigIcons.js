import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';

import STL_CAFES from '../../data/stl_cafes.json';
const store = createStore(combineReducers({'map': SdkMapReducer}));

export default class MAP extends Component {
  componentDidMount() {
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
    // Start with a reasonable global view of hte map.
    store.dispatch(SdkMapActions.setView([-90.1911121, 38.6251834], 10));
    store.dispatch(SdkMapActions.addSource('cafe', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'coffeePoints',
      source: 'cafe',
      type: 'symbol',
      layout: {
        'text-font': [
          'FontAwesome normal',
        ],
        'text-size': 50,
        'icon-optional': true,
        'text-field': '\uf111',
      },
      paint: {
        'text-color': '#CF5300',
      },
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
    this.quickAddPoint(STL_CAFES);
  }
  quickAddPoint(json) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      store.dispatch(SdkMapActions.addFeatures('cafe', [{
        type: 'Feature',
        properties: {name: feature.properties.name},
        geometry: feature.geometry,
      }]));
    }
  }
  coffeeShape() {
    // Being Lazing, should design better
    const map = store.getState();
    for (let i = 0; i <= map.layers.length; i++) {
      if (map.layers[i].id === 'coffeePoints') {
        console.log(map.layers[i].paint);
      }
    }
    // store.dispatch(SdkMapActions.updateLayer('cafe', {
    //   paint: Object.assign({}, layer.paint, {
    //     'fill-opacity': opacity,
    //   })
    // }));
  }
  render() {
    const button = (
      <button onClick={() => this.coffeeShape()}>Coffee Shop</button>
    );
    return (
      <div  className="slideContent">
        <header><h3>Coffee Shops Near FOSS 4G</h3></header>
        <content>
          <div className="left skinny">
            {button}
          </div>
          <div className="right fat">
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
          <img src={pageOne} alt='Boundless Geospacial' height="34"></img>
        </footer>
      </div>
    );
  }
}
