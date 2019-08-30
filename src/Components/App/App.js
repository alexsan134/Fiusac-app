import React, { Component } from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Sidenav from '../Sidenav/Sidenav';
import Navbar from '../Navbar/Navbar';
import Calendar from '../Calendar/Calendar';
import NotFound from '../404/404';
import UserManager from "../UserManager/UserManager";
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
              <Route exact path="/cuenta" component={UserManager} />
              <Route path="/buscar/:id" render={props => (<Search keyword={props.match.params.id} />)} />
              <Route path="*" component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </main>
    )
  }
}

export default App;
