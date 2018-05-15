import React, {Component} from 'react';

export default class title extends Component {
  render() {
    return (
      <div className="landing slideContent">
        <h1>Why is that map so usable?</h1>
        <h2> Willie and Jeremy</h2>
        <h2> https://github.com/wnordmann/Foss4gNA2018</h2>
        <div className="names">
          <span className="first">
            <h3>Willie</h3>
            <p>wnordman@boundlessgeo.com</p>
          </span>
          <span>
            <h3>Jeremy</h3>
            <p>jmulenex@boundlessgeo.com</p>
          </span>
        </div>
        <h4>Are you happy now?</h4>
      </div>
    );
  }
}
