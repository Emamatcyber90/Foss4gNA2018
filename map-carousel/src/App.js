import React, {Component} from 'react';
import './App.css';
import Slider from 'react-slick';

import ZoomWithout from './maps/zoom/ZoomWithout';
import ZoomWith from './maps/zoom/ZoomWith';
import LayerListWith from './maps/layerList/layerListWith';
import LayerListWithout from './maps/layerList/layerListWithout';
import BigIcon from './maps/featureStyle/bigIcons';
import SmallIcon from './maps/featureStyle/smallerIcons';
import PolygonSolid from './maps/featureStyle/polygonSolid';

import Title from './title.js';
import Sdk from './sdkSlide.js';

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
    return (
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
            <div>
              <PolygonSolid/>
            </div>
          </Slider>
        </div>
      </div>
    );
  }
}

export default App;
