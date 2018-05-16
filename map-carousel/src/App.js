import React, {Component} from 'react';
import './App.css';
import Slider from 'react-slick';

import ZoomWithout from './maps/zoom/ZoomWithout';
import ZoomWith from './maps/zoom/ZoomWith';
import LayerListWith from './maps/layerList/layerListWith';
import BigIcon from './maps/featureStyle/bigIcons';
import Popup from './maps/popup/popup';

import Title from './title.js';
import Sdk from './sdkSlide.js';
import UIUX from './UI-UX.js';

class App extends Component {

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
  render() {
    const settings = {
      dots: true,
      draggable: false,
    };
    const full = (
      <div className="App">
        <div className="Map-container">
          <Slider {...settings}>
            <div>
              <Title/>
            </div>
            <div>
              <Sdk/>
            </div>
            <div>
              <UIUX/>
            </div>
            <div>
              <ZoomWithout/>
            </div>
            <div>
              <ZoomWith/>
            </div>
            <div>
              <LayerListWith/>
            </div>
            <div>
              <BigIcon/>
            </div>
            <div>
              <Popup/>
            </div>
          </Slider>
        </div>
      </div>
    );
    // const full = (<div className="App">
    //   <div className="Map-container">
    //     <Slider {...settings}>
    //       <div>
    //         <LayerListWith/>
    //       </div>
    //     </Slider>
    //   </div>
    // </div>);
    return full;
  }
}

export default App;


//   sources: {
//     'bcs-mapbox-light': {
//       type: 'raster',
//       tileSize: 256,
//       tiles: [
//         'https://bcs.boundlessgeo.io/basemaps/mapbox/light/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
//       ]
//     },
//     'bcs-mapbox-dark': {
//       type: 'raster',
//       tileSize: 256,
//       tiles: [
//         'https://bcs.boundlessgeo.io/basemaps/mapbox/dark/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
//       ]
//     },
//     'bcs-mapbox-outdoors': {
//       type: 'raster',
//       tileSize: 256,
//       tiles: [
//         'https://bcs.boundlessgeo.io/basemaps/mapbox/outdoors/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
//       ]
//     },
//     'bcs-planet-2018_03': {
//       type: 'raster',
//       tileSize: 256,
//       tiles: [
//         'https://bcs.boundlessgeo.io/basemaps/planet/2018_03/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
//       ]
//     },
//     'bcs-planet-2016_01': {
//       type: 'raster',
//       tileSize: 256,
//       tiles: [
//         'https://bcs.boundlessgeo.io/basemaps/planet/2016_01/{z}/{x}/{y}.png?version=0.1&apikey=7ebdd7146b8e70445ef023e7df61dfc0'
//       ]
//     },
//     countries: {
//       type: 'geojson',
//       metadata: {},
//       data: {}
//     },
//     purchasing_data: {
//       type: 'geojson',
//       metadata: {},
//       data: {}
//     }
//   }
// }
