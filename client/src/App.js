import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import socketIOClient from "socket.io-client";

class App extends Component {
  state = { picks: [] };
  componentDidMount() {
      const socket = socketIOClient('http://localhost:3000');
      socket.on('server:picks-data', data => {
          console.log(data);
          this.setState({
              picks: [data].concat(this.state.picks)
          });
      });
  }
  render() {
      return (
          <div className="App">
              <header className="App-header">
                  <h1 className="App-title">robinhood-playground</h1>
              </header>
              <p className="App-intro">
                  {this.state.picks.map(pick => (
                      <pre>{JSON.stringify(pick, null, 2)}</pre>
                  ))}
              </p>
          </div>
      );
  }
}

export default App;
