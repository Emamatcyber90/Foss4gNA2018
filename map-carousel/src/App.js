import React, {Component} from 'react';
import logo from './logo.svg';
import './App.css';
import {createStore, combineReducers} from 'redux';
import Slider from 'react-slick';

import ZoomWithout from './maps/zoom/ZoomWithout';
import ZoomWith from './maps/zoom/ZoomWith';
import LayerListWith from './maps/layerList/layerListWith';
// import LayerListWithout from './maps/layerList/layerListWithout';

import SdkMap from '@boundlessgeo/sdk/components/map';
import SdkMapReducer from '@boundlessgeo/sdk/reducers/map';
import * as SdkMapActions from '@boundlessgeo/sdk/actions/map';
import Title from './title.js';

const store = createStore(combineReducers({
  'map': SdkMapReducer,
}));

class App extends Component {
  componentDidMount() {
  // add the OSM source
    store.dispatch(SdkMapActions.addOsmSource('osm'));

    // add an OSM layer
    store.dispatch(SdkMapActions.addLayer({
      id: 'osm',
      source: 'osm',
    }));
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
      <div className="App" >
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <div className="Map-container">
          <Slider {...settings}>
            <div>
              <Title/>
            </div>
            <div>
              <ZoomWith/>
            </div>
            <div>
              <ZoomWithout/>
            </div>
            <div>
              <LayerListWith/>
            </div>
            <div>

            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;
