import React, { Component } from 'react';
import rp from 'request-promise';
import moment from 'moment';
import './InfoBox.css';

class InfoBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPrice: null,
      monthChangeD: null,
      monthChangeP: null,
      updatedAt: null
    }
  }
  componentWillMount(){
    const {data} = this.props;
    const getData = async () => {
      const livePrices = {
        uri: `http://api.coindesk.com/v1/bpi/currentprice.json`,
        json: true
      }

      const bitcoinData = await rp(livePrices);
      const price = bitcoinData.bpi.USD.rate_float;
      const change = price - data[0].y;
      const changeP = (price - data[0].y) / data[0].y * 100;

      this.setState({
        currentPrice: bitcoinData.bpi.USD.rate_float,
        monthChangeD: change.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' }),
        monthChangeP: changeP.toFixed(2) + '%',
        updatedAt: bitcoinData.time.updated
      })
    }
    getData();
  }
  render(){
    return (
      <div id="data-container">
        { this.state.currentPrice ?
          <div id="left" className='box'>
            <div className="heading">{this.state.currentPrice.toLocaleString('us-EN',{ style: 'currency', currency: 'USD' })}</div>
            <div className="subtext">{'Updated ' + moment(this.state.updatedAt ).fromNow()}</div>
          </div>
        : null}
        { this.state.currentPrice ?
          <div id="middle" className='box'>
            <div className="heading">{this.state.monthChangeD}</div>
            <div className="subtext">Change Since Last Month (USD)</div>
          </div>
        : null}
          <div id="right" className='box'>
            <div className="heading">{this.state.monthChangeP}</div>
            <div className="subtext">Change Since Last Month (%)</div>
          </div>

      </div>
    );
  }
}

export default InfoBox;
