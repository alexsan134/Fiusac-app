import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Sidenav from '../Sidenav/Sidenav';
import Navbar from '../Navbar/Navbar';
import Calendar from '../Calendar/Calendar';
import Home from '../Home/Home';
import Search from '../Search/Search';
import Tutorial from '../Tutorial/Tutorial';
import './App.css';
import 'material-design-icons/iconfont/material-icons.css';
import 'materialize-css/dist/css/materialize.min.css';

class App extends Component {
  render() {
    return (
      <main>
        <BrowserRouter>
          <div>
            <Sidenav />
            <Navbar />
            <Switch>
              <Route exact path="/" component={Home} />
              <Route exact path="/horario" component={Calendar} />
              <Route exact path="/tutorial" component={Tutorial} />
              <Route path="/buscar/:id" render={props => (<Search keyword={props.match.params.id} />)} />
            </Switch>
          </div>
        </BrowserRouter>
      </main>
    )
  }
}

export default App;
