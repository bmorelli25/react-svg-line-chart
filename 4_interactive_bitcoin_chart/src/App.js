import React, { Component } from 'react';
import rp from 'request-promise';
import moment from 'moment';
import './App.css';
import LineChart from './LineChart';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fetchingData: true,
      data: null
    }
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
          d: moment(date).format('MMM DD'),
          p: price,
          x: count, //previous days
          y: bitcoinData.bpi[date] // numerical price
        });
        count++;
      }
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
        { !this.state.fetchingData ? <LineChart data={this.state.data} /> : null }
      </div>
    );
  }
}

export default App;
