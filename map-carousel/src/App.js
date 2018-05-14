import React, {Component} from 'react';
import './App.css';
// import {createStore, combineReducers} from 'redux';
import Slider from 'react-slick';

import ZoomWithout from './maps/zoom/ZoomWithout';
import ZoomWith from './maps/zoom/ZoomWith';
import LayerListWith from './maps/layerList/layerListWith';
import LayerListWithout from './maps/layerList/layerListWithout';
import BigIcon from './maps/featureStyle/bigIcons';
import SmallIcon from './maps/featureStyle/smallerIcons';

// import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
// import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import Title from './title.js';
//
// const store = createStore(combineReducers({
//   'map': SdkMapReducer,
// }));

class App extends Component {
  componentDidMount() {
  // // add the OSM source
  //   store.dispatch(SdkMapActions.addOsmSource('osm'));
  //
  //   // add an OSM layer
  //   store.dispatch(SdkMapActions.addLayer({
  //     id: 'osm',
  //     source: 'osm',
  //   }));
  }

  constructor(props) {
    super(props);
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
  }
  next() {
    this.slider.slickNext();
  }
  previous() {
    this.slider.slickPrev();
  }
  handleKeyPress(event) {
    // console.log(event.key);
    // this.next();
  }
  render() {
    const settings = {
      dots: true,
      draggable: false,
    };
    return (
      <div className="App">
        <div className="Map-container">
          <Slider {...settings}>
            <div>
              <Title/>
            </div>
            <div>
              <ZoomWithout/>
            </div>
            <div>
              <ZoomWith/>
            </div>
            <div>
              <LayerListWithout/>
            </div>
            <div>
              <LayerListWith/>
            </div>
            <div>
              <BigIcon/>
            </div>
            <div>
              <SmallIcon/>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;
