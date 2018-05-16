import React, {Component} from 'react';

export default class title extends Component {
  render() {
    return (
      <div className="landing slideContent">
        <h1>What is UI/UX?</h1>
        <div className="names">
          <span className="first">
            <h3>UI</h3>
            <p>User Interaction</p>
            <p>What the users sees, clicks on, types in</p>
          </span>
          <span>
            <h3>UX</h3>
            <p>User Experience</p>
            <p>How many clicks to perform an action</p>
            <p>Applications Ease of use</p>
          </span>
        </div>
        <h4>https://github.com/wnordmann/Foss4gNA2018</h4>
      </div>
    );
  }
}
