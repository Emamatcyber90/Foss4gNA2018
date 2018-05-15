import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';

import STATES from '../../data/states.json';

const store = createStore(combineReducers({'map': SdkMapReducer}));

export default class MAP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false
    };
  }
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
    store.dispatch(SdkMapActions.setView([-90, 38], 2));

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
    store.dispatch(SdkMapActions.addSource('points', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addSource('states', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'states-fill',
      source: 'states',
      type: 'fill',
      'paint': {
        'fill-color': '#eeffee',
        'line-color': '#aa33ee'
      }
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'random-points',
      source: 'points',
      type: 'circle',
      paint: {
        'circle-radius': 3,
        'circle-color': '#756bb1',
        'circle-stroke-color': '#756bb1',
      },
      filter: ['!has', 'point_count'],
    }));
    this.addRandomPoints(200);
    this.quickAddPolygon(STATES);
  }

  // Add a random point to the map
  addRandomPoints(nPoints = 10) {
    // loop over adding a point to the map.
    for (let i = 0; i < nPoints; i++) {
      // the feature is a normal GeoJSON feature definition,
      // 'points' referes to the SOURCE which will get the feature.
      store.dispatch(SdkMapActions.addFeatures('points', [{
        type: 'Feature',
        properties: {
          title: 'Random Point',
          isRandom: true,
        },
        geometry: {
          type: 'Point',
          // this generates a point somewhere on the planet, unbounded.
          coordinates: [(Math.random() * 360) - 180, (Math.random() * 180) - 90],
        },
      }]));
    }
  }
  quickAddPolygon(json) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      store.dispatch(SdkMapActions.addFeatures('states', [{
        type: 'Feature',
        properties: {name: feature.properties.name},
        geometry: feature.geometry,
      }]));
    }
  }
  render() {
    let answer = false;
    if (this.state.show) {
      answer = (<span>
        <p>No legend</p>
        <p>No Layer List</p>
        <p>No Labels</p>
        <p>Colors tell nothing</p>
      </span>);
    }
    return (
      <div  className="slideContent">
        <header><h3>What is going on here?</h3></header>
        <content>
          <div className="left skinny">
            <h6>A good answer gets swag.</h6>
            <button className="sdk-btn" onClick={()=>this.setState({show: true})}>show</button>
            {answer}
          </div>
          <div className="right fat">
            <map>
              <Provider store={store}>
                <SdkMap store={store}>
                  <SdkZoomControl />
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
