import React, { Component } from 'react';
import './App.css';
import LineChart from './LineChart';

class App extends Component {

  render() {
    const data = []

    for (let x = 1, y = 50; x <= 30; x++) {    
      data.push({
        x,
        y: Math.floor(Math.random() * (100)) })
    }

    return (
      <div className="App">
        <div className="header">react svg line chart [part 1]</div>
        <LineChart data={data} />
      </div>
    );
  }
}

export default App;
