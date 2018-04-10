import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";

import getTrend from './utils/get-trend';
import avgArray from './utils/avg-array';

class Pick extends Component {
  state = {
      showingDetails: false
  };
  toggleDetails = () => {
      this.setState({ showingDetails: !this.state.showingDetails })
  };
  render() {
      const { showingDetails } = this.state;
      const { pick } = this.props;
      return (
          <div>
              <button onClick={this.toggleDetails}>
                  {showingDetails ? '-' : '+'}
              </button>
              <b>{pick.stratMin}</b><br/>
              <i>avg trend: {pick.avgTrend}</i>

              {
                showingDetails && (
                    <table>
                        <thead>
                            <th>ticker</th>
                            <th>thenPrice</th>
                            <th>nowPrice</th>
                            <th>trend</th>
                        </thead>
                        <tbody>
                            {
                                pick.withTrend.map(tickerObj => (
                                    <tr>
                                        <td>{tickerObj.ticker}</td>
                                        <td>{tickerObj.thenPrice}</td>
                                        <td>{tickerObj.nowPrice}</td>
                                        <td>{tickerObj.trend}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                )
              }

          </div>
      );
  }
}

class App extends Component {
  state = { picks: [], relatedPrices: {} };
  componentDidMount() {
      const socket = socketIOClient('http://localhost:3000');
      socket.on('server:picks-data', data => {
          console.log(data);
          this.setState({
              picks: [data].concat(this.state.picks)
          });
      });
      socket.on('server:welcome', data => {
          this.setState(data);
      });
      socket.on('server:related-prices', data => {
          this.setState({ relatedPrices: data });
      });
  }
  render() {
      let { picks, relatedPrices } = this.state;
      picks = picks.map(pick => {
          const calcedTrend = pick.withPrices.map(({ ticker, price }) => {
              return {
                  ticker,
                  thenPrice: price,
                  nowPrice: relatedPrices[ticker],
                  trend: getTrend(relatedPrices[ticker], price)
              };
          });
          return {
              ...pick,
              avgTrend: avgArray(calcedTrend.map(t => t.trend)),
              withTrend: calcedTrend
          };
      });
      const sortedByAvgTrend = picks.sort((a, b) => b.avgTrend - a.avgTrend);
      return (
          <div className="App">
              <header className="App-header">
                  <h1 className="App-title">robinhood-playground</h1>
              </header>
              <p className="App-intro">
                  {
                    sortedByAvgTrend.map(pick => (
                        <Pick pick={pick} />
                    ))
                  }
              </p>
          </div>
      );
  }
}

export default App;
