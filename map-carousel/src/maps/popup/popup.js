import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';

import STL_PARKS from '../../data/stl_parks.json';
import STL_TAX from '../../data/stl_tax_codes.json';
import STL_NEIGHBOR from '../../data/Neighborhoods.json';
const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

/** A popup for marking features when they
 *  are selected.
 */
class MarkFeaturesPopup extends SdkPopup {

  constructor(props) {
    super(props);
    this.markFeatures = this.markFeatures.bind(this);
  }

  markFeatures(evt) {
    const feature_ids = [];
    const features = this.props.features;

    for (let i = 0, ii = features.length; i < ii; i++) {
      // create an array of ids to be removed from the map.
      feature_ids.push(features[i].properties.id);
      // set the feature property to "marked".
      features[i].properties.isMarked = true;
    }

    // remove the old unmarked features
    store.dispatch(SdkMapActions.removeFeatures('points', ['in', 'id'].concat(feature_ids)));
    // add the new freshly marked features.
    store.dispatch(SdkMapActions.addFeatures('points', features));
    // close this popup.
    this.close(evt);
  }
  buildAttrList(feature) {
    const li = [];
    const keys = Object.keys(feature.properties);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      li.push(<li key={key}>{key}: {feature.properties[key]}</li>);
    }
    return li;
  }
  render() {
    return this.renderPopup((
      <div className="sdk-popup-content">
        You clicked here:<br />
        <code>
          { this.props.coordinate.hms }
        </code>
        <br />
        <p>
          <ul className='popup-list'>
            {this.buildAttrList(this.props.features[0])}
          </ul>
        </p>
      </div>
    ));
  }
}

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
    store.dispatch(SdkMapActions.addSource('tax', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'tax area',
      source: 'tax',
      type: 'fill',
      'paint': {
        'fill-color': '#2ca25f',
        'line-color': '#000000'
      }
    }));
    store.dispatch(SdkMapActions.addSource('neighborhood', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'neighborhood area',
      source: 'neighborhood',
      type: 'fill',
      'paint': {
        'fill-color': '#2ca25f',
        'line-color': '#000000'
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
    this.quickAddPoint(STL_PARKS, 'park');
    this.quickAddPoint(STL_TAX, 'tax');
    this.quickAddPoint(STL_NEIGHBOR, 'neighborhood');
  }
  quickAddPoint(json, sourceName) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      store.dispatch(SdkMapActions.addFeatures(sourceName, [{
        type: 'Feature',
        properties: feature.properties,
        geometry: feature.geometry,
      }]));
    }
  }
  buildAttrListFromState() {
    const feature = this.state.feature;
    if (feature !== undefined) {
      const li = [];
      const keys = Object.keys(feature.properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        li.push(<li key={key}>{key}: {feature.properties[key]}</li>);
      }
      return li;
    }
    return false;
  }
  render() {
    return (
      <div  className="slideContent">
        <content>
          <div className="left skinny">
            <button onClick={() => this.setState({show: true})}>show</button>
            {this.state.show ? <ul>{this.buildAttrListFromState()}</ul> : false}
          </div>
          <div className="right fat">
            <h3>St. Louis Park and Tax districts</h3>
            <map>
              <Provider store={store}>
                <SdkMap
                  style={{position: 'relative'}}
                  includeFeaturesOnClick
                  onClick={(map, xy, featuresPromise) => {
                    featuresPromise.then((featureGroups) => {
                    // setup an array for all the features returned in the promise.
                      let features = [];
                      // featureGroups is an array of objects. The key of each object
                      // is a layer from the map.
                      for (let g = 0, gg = featureGroups.length; g < gg; g++) {
                      // collect every feature from each layer.
                        const layers = Object.keys(featureGroups[g]);
                        for (let l = 0, ll = layers.length; l < ll; l++) {
                          const layer = layers[l];
                          features = features.concat(featureGroups[g][layer]);
                        }
                      }
                      if (features.length === 0) {
                      // no features, :( Let the user know nothing was there.
                        map.addPopup(<SdkPopup coordinate={xy} closeable><i>No features found.</i></SdkPopup>);
                      } else {
                        if (this.state.show) {
                          this.setState({feature: features[0]});
                        } else {
                        // Show the super advanced fun popup!
                          map.addPopup(<MarkFeaturesPopup coordinate={xy} features={features} closeable />);
                        }
                      }
                    }).catch((exception) => {
                      console.error('An error occurred.', exception);
                    });
                  }}
                >
                </SdkMap>
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
