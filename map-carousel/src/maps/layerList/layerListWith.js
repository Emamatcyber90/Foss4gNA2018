import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';
import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';
import SdkLayerList from '@boundlessgeo/sdk/components/layer-list';
import SdkLayerListItem from '@boundlessgeo/sdk/components/layer-list-item';
import {DragSource, DropTarget} from 'react-dnd';
import {types, layerListItemSource, layerListItemTarget, collect, collectDrop} from '@boundlessgeo/sdk/components/layer-list-item';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

class LayerListItem extends SdkLayerListItem {
  render() {
    const layer = this.props.layer;
    const checkbox = this.getVisibilityControl(layer);

    const moveButtons = (
      <span>
        <button className="sdk-btn" onClick={() => {
          this.moveLayerUp();
        }}>
          { this.props.labels.up }
        </button>
        <button className="sdk-btn" onClick={() => {
          this.moveLayerDown();
        }}>
          { this.props.labels.down }
        </button>
        <button className="sdk-btn" onClick={() => {
          this.removeLayer();
        }}>
          { this.props.labels.remove }
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
    up: 'Move up',
    down: 'Move down',
    remove: 'Remove layer',
  },
};

LayerListItem = DropTarget(types, layerListItemTarget, collectDrop)(DragSource(types, layerListItemSource, collect)(LayerListItem));


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
    store.dispatch(SdkMapActions.setView([-93, 45], 2));

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
    // 'geojson' sources allow rendering a vector layer
    // with all the features stored as GeoJSON. "data" can
    // be an individual Feature or a FeatureCollection.
    store.dispatch(SdkMapActions.addSource('dynamic-source', {type: 'geojson'}));

    store.dispatch(SdkMapActions.addLayer({
      id: 'dynamic-layer',
      type: 'circle',
      source: 'dynamic-source',
      paint: {
        'circle-radius': 5,
        'circle-color': '#552211',
        'circle-stroke-color': '#00ff11',
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
    // add the wms source
    store.dispatch(SdkMapActions.addSource('states', {
      type: 'raster',
      tileSize: 256,
      tiles: ['https://demo.boundlessgeo.com/geoserver/usa/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&FORMAT=image/png&SRS=EPSG:900913&LAYERS=topp:states&STYLES=&WIDTH=256&HEIGHT=256&BBOX={bbox-epsg-3857}'],
    }));
    // add the wms layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'states',
      source: 'states',
      type: 'raster',
    }));
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

  render() {
    this.addRandomPoints(200);
    return (
      <Provider store={store}>
        <SdkMap>
          <SdkLayerList layerClass={LayerListItem} />
        </SdkMap>
      </Provider>
    );
  }
}
