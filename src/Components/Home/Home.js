import React, { Component } from 'react';
import { auth } from "firebase/app";
import { Link } from 'react-router-dom';
import Calendar from './calendar.png';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { day: new Date(), user: { displayName:'' } };
    this.isSafe = false;
  }
  componentDidMount() {
    this.isSafe = true;
    this.timer = setInterval(() => this.setState({ day: new Date() }), 1000);
    auth().onAuthStateChanged(user =>{
      if(this.isSafe && user) this.setState({user});
    })

  }
  componentWillUnmount() {
    clearInterval(this.timer);
    this.isSafe = false;
  }
  render() {
    //Global Variables
    const day = this.state.day;
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

    // Parse function
    const pad = (d) => (d < 10) ? '0' + d.toString() : d.toString();

    //Main text
    const time = day.getHours() <= 12 ? day.getHours() === 12 ? `${day.getHours()}:${pad(day.getMinutes())}pm` : `${day.getHours()}:${pad(day.getMinutes())} a.m` : `${(day.getHours() - 12)}:${pad(day.getMinutes())} p.m`;

    return (
      <div id="homeCont">
        <Link to="/horario">
          <div id="contHours">
            <span id="infoSv">Bienvenido {this.state.user.displayName.split(' ')[0]}</span>
            <h5>{days[day.getDay()]}, {day.getDate()} de {months[day.getMonth()]}</h5>
            <h4>{time}</h4>
            <img src={Calendar} alt="Calendar icon" />
          </div>
        </Link>
      </div>
    )
  }
}

export default Home;