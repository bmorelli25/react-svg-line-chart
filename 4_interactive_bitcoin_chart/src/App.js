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
        <div className='container'>
          <div className='row'>
            <div className='side'>
            </div>
            <div className='main'>
              <div className="header">30 Day Bitcoin Price Chart -
                <span id="coindesk"> Powered by <a href="http://www.coindesk.com/price/">CoinDesk</a></span>
              </div>
            </div>
          </div>
        </div>

        {
          !this.state.fetchingData ?
          <LineChart data={this.state.data} onPointHover={ this.handlePointHover } /> :
          null
        }




      </div>
    );
  }
}

export default App;
