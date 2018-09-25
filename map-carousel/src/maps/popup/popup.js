import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';
import SdkPopup from '@boundlessgeo/sdk/components/map/popup';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';

// import STL_PARKS from '../../data/stl_parks.json';
import STL_TAX from '../../data/stl_tax_codes.json';
// import STL_NEIGHBOR from '../../data/Neighborhoods.json';
const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

/** A popup for marking features when they
 *  are selected.
 */
class MarkFeaturesPopup extends SdkPopup {
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
        <span>
          <ul className='popup-list'>
            {this.buildAttrList(this.props.features[0])}
          </ul>
        </span>
      </div>
    ));
  }
}

export default class MAP extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      clickLocation: '',
      featureId: '',
      oldFeature: {},
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
      },
      filter: ['!=', 'isMarked', true],
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'taxMarked',
      source: 'tax',
      type: 'fill',
      'paint': {
        'fill-color': '#99a25f',
        'line-color': '#005500'
      },
      filter: ['==', 'isMarked', true],
    }));
    // store.dispatch(SdkMapActions.addSource('neighborhood', {
    //   type: 'geojson',
    //   clusterRadius: 50,
    //   data: {
    //     type: 'FeatureCollection',
    //     features: [],
    //   },
    // }));
    // store.dispatch(SdkMapActions.addLayer({
    //   id: 'neighborhoodarea',
    //   source: 'neighborhood',
    //   type: 'fill',
    //   'paint': {
    //     'fill-color': '#2ca25f',
    //     'line-color': '#000000'
    //   },
    //   filter: ['!=', 'isMarked', true],
    // }));
    // store.dispatch(SdkMapActions.addLayer({
    //   id: 'neighborhoodMarked',
    //   source: 'neighborhood',
    //   type: 'fill',
    //   'paint': {
    //     'fill-color': '#99a25f',
    //     'line-color': '#005500'
    //   },
    //   filter: ['==', 'isMarked', true],
    // }));

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
    // this.quickAddPoint(STL_PARKS, 'park', true);
    this.quickAddPoint(STL_TAX, 'tax');
    // this.quickAddPoint(STL_NEIGHBOR, 'neighborhood');
  }
  quickAddPoint(json, sourceName, nameOnly = false) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      const properties =  nameOnly ? {name: feature.properties.name} : feature.properties;
      store.dispatch(SdkMapActions.addFeatures(sourceName, [{
        type: 'Feature',
        properties: Object.assign({}, properties, {id: `${sourceName}${i}`, isMarked: false}),
        geometry: feature.geometry,
      }]));
    }
  }
  markFeatures() {
    const features = [];
    const feature = this.state.feature;
    const sourceName = 'neighborhoodMarked';

    const feature_ids = [];
    let oldFeature = {};
    if (this.state.oldFeature !== undefined) {
      oldFeature = this.state.oldFeature;
      oldFeature.properties.isMarked = false;
      features.push(oldFeature);
      feature_ids.push(this.state.oldFeature.properties.id);
    }
    // this.setState({featureId: feature.properties.id});
    // create an array of ids to be removed from the map.
    feature_ids.push(feature.properties.id);
    // set the feature property to "marked".
    feature.properties.isMarked = true;

    features.push(feature);
    // remove the old unmarked features
    store.dispatch(SdkMapActions.removeFeatures(sourceName, ['in', 'id'].concat(feature_ids)));
    // add the new freshly marked features.
    store.dispatch(SdkMapActions.addFeatures(sourceName, features));
  }
  buildAttrListFromState() {
    const feature = this.state.feature;
    if (feature !== undefined) {
      this.markFeatures();
      const li = [];
      const keys = Object.keys(feature.properties);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        li.push(<li key={key}>{key}: {feature.properties[key]}</li>);
      }
      return (
        <div className="sdk-popup-content">
          <p>
            You clicked here:<br />
            <code>
              { this.state.clickLocation }
            </code>
          </p>
          <span>
            <ul className='popup-list'>
              {li}
            </ul>
          </span>
        </div>
      );
    }
    return false;
  }
  render() {
    return (
      <div  className="slideContent">
        <header>
          <h3>St. Louis Park and Tax districts</h3>
        </header>
        <content>
          <div className="left skinny">
            {this.state.show ? <span>{this.buildAttrListFromState()}</span>
              : <button className="sdk-btn" onClick={() => this.setState({show: true})}>show</button>}
          </div>
          <div className="right fat">
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
                        const old = this.state.feature;
                        if (this.state.show) {
                          this.setState({feature: features[0],
                            oldFeature: old,
                            clickLocation: xy.hms,
                          });
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
