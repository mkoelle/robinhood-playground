import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";

import getTrend from './utils/get-trend';
import avgArray from './utils/avg-array';

const trendPerc = (num, redAt = 0) => (
    <span className={ num > redAt ? 'positive' : 'negative'}>
        {num.toFixed(2)}%
    </span>
);

class Pick extends Component {
  state = {
      showingDetails: false
  };
  toggleDetails = () => {
      console.log('toggle!');
      this.setState({ showingDetails: !this.state.showingDetails })
  };
  render() {
      const { showingDetails } = this.state;
      const { pick, fiveDay } = this.props;
      let percUpFontSize = fiveDay ? fiveDay.percUp * 100.4 : 100;
      if (fiveDay && fiveDay.avgTrend > 1) percUpFontSize *= 1.9;
      return (
          <div className="pick" style={{ fontSize: Math.max(percUpFontSize, 39) + '%'}}>
              <button onClick={this.toggleDetails}>
                  {showingDetails ? '-' : '+'}
              </button>
              <b>{trendPerc(pick.avgTrend)}</b>
              <strong>{' ' + pick.stratMin}</strong>
              <hr/>
              {fiveDay && (
                <i>
                  5 day - avgTrend {trendPerc(fiveDay.avgTrend)}%
                  - percUp {trendPerc(fiveDay.percUp * 100, 50)}
                  - count {fiveDay.count}
                </i>
              )}
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
                                        <td>{tickerObj.trend}%</td>
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
  state = { picks: [], relatedPrices: {}, strategyFilter: 'vip', pastData: {}, strategies: {}, afterHoursEnabled: false };
  componentDidMount() {
      const { protocol, hostname } = window.location;
      let endpoint = `${protocol}//${hostname}`;
      if (hostname === 'localhost') {
          endpoint += ':3000';
      }
      const socket = socketIOClient(endpoint);
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
  setStrategyFilter = (event) => {
      this.setState({
          strategyFilter: event.target.value
      });
  }
  toggleAfterHours = () => this.setState({ afterHoursEnabled: !this.state.afterHoursEnabled })
  render() {
      let { picks, relatedPrices, strategies, strategyFilter, pastData, curDate, afterHoursEnabled } = this.state;
      const { fiveDay } = pastData;
      const { vip: vipStrategies } = strategies;
      if (!vipStrategies) return <h1 style={{ textAlign: 'center' }}>loading</h1>;
      picks = picks.map(pick => {
          const calcedTrend = pick.withPrices.map(({ ticker, price }) => {
              const { lastTradePrice, afterHourPrice } = relatedPrices[ticker];
              const nowPrice = afterHoursEnabled ? afterHourPrice || lastTradePrice : lastTradePrice;
              return {
                  ticker,
                  thenPrice: price,
                  nowPrice,
                  trend: getTrend(nowPrice, price)
              }
          });
          return {
              ...pick,
              avgTrend: avgArray(calcedTrend.map(t => t.trend)),
              withTrend: calcedTrend
          };
      });
      let sortedByAvgTrend = picks.sort((a, b) => Number(b.avgTrend) - Number(a.avgTrend));
      if (strategyFilter !== 'no filter') {
          console.log('strat', strategyFilter, strategies[strategyFilter])
          sortedByAvgTrend = sortedByAvgTrend.filter(strat => strategies[strategyFilter].includes(strat.stratMin));
      }
      console.log('rendering!');
      const avgTrendOverall = avgArray(sortedByAvgTrend.map(strat => strat.avgTrend).filter(val => !!val));
      return (
          <div className="App">
              <header className="App-header">
                  <h1 className="App-title">robinhood-playground: {curDate}</h1>
                  strategy filter:
                  <select value={strategyFilter} onChange={this.setStrategyFilter}>
                      {strategies && Object.keys(strategies).map(strategy => (
                          <option value={strategy}>{strategy}</option>
                      ))}
                      <option>no filter</option>
                  </select>
                  <br/>
                  include after hours:
                  <input type="checkbox" checked={afterHoursEnabled} onChange={this.toggleAfterHours} />
              </header>
              <p>
                  <h2>overall average trend: {trendPerc(avgTrendOverall)}</h2>
              </p>
              <p className="App-intro">
                  {
                      sortedByAvgTrend.slice(0, 200).map(pick => (
                          <div>
                              <Pick
                                  pick={pick}
                                  key={pick.stratMin}
                                  fiveDay={fiveDay ? fiveDay[pick.stratMin] : null}
                              />
                          </div>
                      ))
                  }
              </p>
          </div>
      );
  }
}

export default App;
