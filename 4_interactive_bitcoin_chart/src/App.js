import React, { Component } from 'react';
import rp from 'request-promise';
import './App.css';
import LineChart from './LineChart';
import NewToolTip from './NewToolTip';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activePoint: null,
      toolTipTrigger: null,
      fetchingData: true,
      data: null
    }
  }

  handlePointHover = (point, trigger) => {
    this.setState({
      activePoint: point,
      toolTipTrigger: trigger
    })
  }

  getMinY() {
    const {data} = this.props;
    return this.state.data.reduce((min, p) => p.y < min ? p.y : min, this.state.data[0].y);
  }
  getMaxY() {
    const {data} = this.props;
    return this.state.data.reduce((max, p) => p.y > max ? p.y : max, this.state.data[0].y);
  }

  componentWillMount(){
    const getData = async () => {
      const historicalPrices = {
        uri: `http://api.coindesk.com/v1/bpi/historical/close.json`,
        json: true
      }

      const bitcoinData = await rp(historicalPrices);
      const sortedData = [];
      let count = 0;
      for (let date in bitcoinData.bpi){
        let price = '$' + bitcoinData.bpi[date].toFixed(2)
        sortedData.push({
          d: date,
          p: price,
          x: count, //previous days
          y: bitcoinData.bpi[date] // numerical price
        });
        count++;
      }
      console.log(sortedData);
      this.setState({
        data: sortedData,
        fetchingData: false
      })
    }
    getData();
  }

  render() {
    return (
      <div className="App">

        <div className="header">Bitcon Price Chart (Last 30 Days)</div>
          <div className='container'>
            <div className='row'>
              <div className='side'>
              </div>
              <div className='main popup'>
                { this.state.toolTipTrigger
                  ? (
                    <NewToolTip trigger={ this.state.toolTipTrigger } point={this.state.activePoint}>
                      <div>Date: { this.state.activePoint.d }</div>
                      <div>Price: { this.state.activePoint.p }</div>
                    </NewToolTip>
                  )
                  : null
                }
              </div>
            </div>
            <div className='row'>
              <div className='side'>
                <span className='min'>{!this.state.fetchingData ? '$' + this.getMaxY().toFixed(2) : null}</span>
                <span className='max'>{!this.state.fetchingData ? '$' + this.getMinY().toFixed(2) : null}</span>
              </div>

              {
                !this.state.fetchingData ?
                <LineChart data={this.state.data} onPointHover={ this.handlePointHover } /> :
                null
              }

            </div>
            <div className='row'>
              <div className='side'>
              </div>
              <div className='main date-label'>
                <span className='min'>{!this.state.fetchingData ? this.state.data[0].d.substr(5) : null}</span>
                <span className='max'>{!this.state.fetchingData ? this.state.data[this.state.data.length - 1].d.substr(5) : null}</span>
              </div>
            </div>
          </div>

      </div>
    );
  }
}

export default App;
