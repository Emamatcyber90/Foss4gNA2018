import React, {Component} from 'react';
import pageOne from './img/BoundlessLogo2018.png';
import square from './img/square.png';

export default class title extends Component {
  render() {
    return (<div className="slideContent">
      <header>
        <h3>What is Boundles SDK</h3>
      </header>
      <content className="sdk">
        <div className="left skinny">
            <img src={square} alt='Boundless Geospacial'></img>
        </div>
        <div className="right fat">
          <div>
            <ul>
              <li>
                Redux and React-Redux now manage the application state.
              </li>
              <li>
                Reduced components down to those that can be reused in multiple frameworks: Map, Legend, Layer List, Popup.
              </li>
              <li>
                Dropped dependence on Material UI
              </li>
              <li>
                OpenLayers upgraded to Version 4.3.1
              </li>
              <li>
                MapBox GL Styles are now used to define the map.
              </li>
              <li>
                98%+ test coverage running through Jest and Enzyme.
              </li>
              <li>
                New examples showcasing common use cases available on github
              </li>
            </ul>
          </div>
        </div>
      </content>
      <footer>
        <img src={pageOne} alt='Boundless Geospacial' height="34"></img>
      </footer>
    </div>);
  }
}
