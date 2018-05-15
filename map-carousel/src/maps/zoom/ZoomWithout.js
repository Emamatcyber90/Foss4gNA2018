import React, {Component} from 'react';
import {createStore, combineReducers} from 'redux';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import {Provider} from 'react-redux';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

export default class ZoomWithout extends Component {
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
          <div className="left skinny">Click and Zoom in</div>
          <div className="right fat">
            <h3>title</h3>
            <map>
              <Provider store={store}>
                <SdkMap store={store} >
                </SdkMap>
              </Provider>
            </map>
            <div className="caption">
              Who needs zoom buttons?
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
