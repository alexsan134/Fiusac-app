import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { auth } from "firebase/app";
import Calendar from './calendar.png';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { day: new Date(), user: '' };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.setState({ day: new Date() }), 1000);
    auth().onAuthStateChanged(user => user !== null ? this.setState({ user: user.displayName }) : false);
  }
  componentWillUnmount() {
    clearInterval(this.timer);
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
        <div id="mainMsj">
          <h4>Bienvenido {this.state.user.split(' ')[0]}!</h4>
          <p>(Esta aplicación es independiente de la facultad de ingenieria). Aquí tienes algunas de las cosas que puedes hacer dentro de la aplicación.</p>
        </div>
        <Link to="/horario">
          <div id="contHours">
            <span id="info">Ver tus cursos en</span>
            <h5>{days[day.getDay()]}, {day.getDate()} de {months[day.getMonth()]}</h5>
            <h4>{time}</h4>
            <img src={Calendar} alt="Calendar icon"/>
          </div>
        </Link>
      </div>
    )
  }
}

export default Home;

