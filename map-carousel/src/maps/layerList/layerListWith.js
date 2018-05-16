import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import pageOne from '../../img/BoundlessLogo2018.png';
import SdkZoomControl from '@boundlessgeo/sdk/components/map/zoom-control';

import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';
import {DragSource, DropTarget} from 'react-dnd';
import {types, layerListItemSource, layerListItemTarget, collect, collectDrop} from '@boundlessgeo/sdk/components/layer-list-item';
import METRORAILS from '../../data/Metro_rails.json';
import NEIGHBORHOODS from '../../data/Neighborhoods.json';
import CYCLE from '../../data/stl_cycleway.json';
import PARKS from '../../data/stl_parks.json';
import TAX from '../../data/stl_tax_codes.json';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

class LayerListItem extends SdkLayerListItem {
  changeOpacity() {
    const layer = this.props.layer;
    let opacity = 1;
    if (layer.paint['fill-opacity'] === undefined || layer.paint['fill-opacity'] === 1) {
      opacity = .5;
    } else if (layer.paint['fill-opacity'] === .5) {
      opacity = .25;
    }
    store.dispatch(SdkMapActions.updateLayer(layer.id, {
      paint: Object.assign({}, layer.paint, {
        'fill-opacity': opacity,
      })
    }));
  }
  render() {
    const layer = this.props.layer;
    const checkbox = this.getVisibilityControl(layer);

    const moveButtons = (
      <span>
        <button className="sdk-btn fa fa-arrow-up" onClick={() => {
          this.moveLayerUp();
        }}>
          { this.props.labels.up }
        </button>
        <button className="sdk-btn fa fa-arrow-down" onClick={() => {
          this.moveLayerDown();
        }}>
          { this.props.labels.down }
        </button>
        <button className="sdk-btn fa fa-trash" onClick={() => {
          this.removeLayer();
        }}>
          { this.props.labels.remove }
        </button>
        <button className="sdk-btn fa fa-rocket" onClick={() => {
          this.changeOpacity('this.props.layers');
        }}>
        </button>
      </span>
    );

    return  this.props.connectDragSource(this.props.connectDropTarget((
      <li className="layer">
        <span className="checkbox">{checkbox}</span>
        <span className="name">{layer.id}</span>
        <span className="btn-container">{moveButtons}</span>
      </li>
    )));
  }
}

LayerListItem.defaultProps = {
  labels: {
    up: '',
    down: '',
    remove: '',
  },
};

LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));


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

    store.dispatch(SdkMapActions.addLayer({
      id: 'Basemap',
      source: 'mblight',
    }));
    // Start with a reasonable global view of hte map.
    store.dispatch(SdkMapActions.setView([-90.1911121, 38.6251834], 10));

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
    // store.dispatch(SdkMapActions.addSource('points', {
    //   type: 'geojson',
    //   clusterRadius: 50,
    //   data: {
    //     type: 'FeatureCollection',
    //     features: [],
    //   },
    // }));

    store.dispatch(SdkMapActions.addSource('metro', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'metro-layer',
      source: 'metro',
      type: 'line',
      'paint': {
        'line-color': '#3333ee'
      }
    }));
    store.dispatch(SdkMapActions.addSource('neighbor', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'neighbor-layer',
      source: 'neighbor',
      type: 'fill',
      'paint': {
        'fill-color': '#9ecae1',
        'line-color': '#3182bd'
      }
    }));
    store.dispatch(SdkMapActions.addSource('cycle', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'cycle-layer',
      source: 'cycle',
      type: 'line',
      'paint': {
        'line-color': '#aa3311'
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
      id: 'tax-layer',
      source: 'tax',
      type: 'fill',
      'paint': {
        'fill-color': '#9ecae1',
        'line-color': '#3182bd'
      }
    }));
    store.dispatch(SdkMapActions.addSource('parks', {
      type: 'geojson',
      clusterRadius: 50,
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    }));
    store.dispatch(SdkMapActions.addLayer({
      id: 'parks-layer',
      source: 'parks',
      type: 'fill',
      'paint': {
        'fill-color': '#2ca25f',
        'line-color': '#bdbdbd'
      }
    }));

    this.quickAddLayer(METRORAILS, 'metro');
    this.quickAddLayer(NEIGHBORHOODS, 'neighbor');
    this.quickAddLayer(CYCLE, 'cycle', true);
    this.quickAddLayer(TAX, 'tax');
    this.quickAddLayer(PARKS, 'parks', true);
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
          coordinates: [(Math.random() * 90) - 180, (Math.random() * 90) - 90],
        },
      }]));
    }
  }
  quickAddLayer(json, sourceName, nameOnly = false) {
    for (let i = 0; i < json.features.length; i++) {
      const feature = json.features[i];
      const properties =  nameOnly ? {name: feature.properties.name} : feature.properties;
      store.dispatch(SdkMapActions.addFeatures(sourceName, [{
        type: 'Feature',
        properties: properties,
        geometry: feature.geometry,
      }]));
    }
  }
  render() {
    const layerList = (
      <span>
        <h6>A layer list helps put a context to your data</h6>
        <Provider store={store}>
          <SdkLayerList layerClass={LayerListItem} />
        </Provider>
      </span>);
    return (
      <div  className="slideContent">
        <header><h3>What is going on here?</h3></header>
        <content>
          <div className="left skinny">
            <h6>A good answer gets swag.</h6>
            <button className="sdk-btn" onClick={()=>this.setState({show: true})}>show</button>
            {this.state.show ? layerList : false}
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
