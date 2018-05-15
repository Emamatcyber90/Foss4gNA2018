import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';

import STL_CAFES from '../../data/stl_cafes.json';
const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

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
    const state = store.getState();
    const layers = state.map.layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].id === 'coffeePoints') {
        store.dispatch(SdkMapActions.updateLayer('coffeePoints', {
          layout: Object.assign({}, layers[i].layout, {
            'text-field': '\uf0f4',
          })
        }));
      }
    }
  }
  smaller() {
    // Being Lazing, should design better
    const state = store.getState();
    const layers = state.map.layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].id === 'coffeePoints') {
        store.dispatch(SdkMapActions.updateLayer('coffeePoints', {
          layout: Object.assign({}, layers[i].layout, {
            'text-size': 18,
          })
        }));
      }
    }
  }
  redder() {
    // Being Lazing, should design better
    const state = store.getState();
    const layers = state.map.layers;
    for (let i = 0; i < layers.length; i++) {
      if (layers[i].id === 'coffeePoints') {
        store.dispatch(SdkMapActions.updateLayer('coffeePoints', {
          paint: Object.assign({}, layers[i].paint, {
            'text-color': '#e34a33',
          })
        }));
      }
    }
  }
  render() {
    let show = false;
    const buttons = (
      <span>
        <button onClick={() => this.coffeeShape()}>Coffee Shape</button>
        <button onClick={() => this.smaller()}>Smaller Size</button>
        <button onClick={() => this.redder()}>Redder color</button>
      </span>
    );
    return (
      <div  className="slideContent">
        <header><h3>Coffee Shops Near FOSS 4G</h3></header>
        <content>
          <div className="left skinny">
            <button onClick={()=>{
              show = true;
            }}>show</button>
            {show ? buttons : false}
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
