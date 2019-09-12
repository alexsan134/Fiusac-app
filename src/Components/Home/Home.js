import React, { Component } from 'react';
import { auth } from "firebase/app";
import { Link } from 'react-router-dom';
import Calendar from './fiusaccalendar.png';
import './Home.css';
import FiusacLogo from './fiusacrss.png';
import AccountLogo from './fiusacuser.png';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { day: new Date(), user: { displayName: 'Amigo' } };
    this.isSafe = false;
  }
  componentDidMount() {
    this.isSafe = true;
    this.timer = setInterval(() => this.setState({ day: new Date() }), 1000);
    auth().onAuthStateChanged(user => {
      if (this.isSafe && user) this.setState({ user });
      else if (this.isSafe) this.setState({ user: { displayName: "Amigo" } })
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
      <div>
        <div id="welBegin">
          <h1>Bienvenido {this.state.user.displayName.split(" ")[0]}</h1>
          <p>Aquí hay algunas de las cosas que puedes hacer dentro de la aplicación:</p>
        </div>
        <div id="homeCont">
          <Link to="/horario">
            <div id="contHours">
              <span id="infoSv">Ver Horarios</span>
              <h5>Ver cursos asignados hoy:<br />{days[day.getDay()]}, {day.getDate()} de {months[day.getMonth()]}</h5>
              <h4>{time}</h4>
              <img src={Calendar} alt="Calendar icon" />
            </div>
          </Link>
          <Link to="/cuenta">
            <div id="welcome">
              <div>
                <h4>Cuenta personal</h4>
                <p>Inicia sesión con tu email o crea una cuenta con gmail o facebook es gratis.</p>
              </div>
              <img src={AccountLogo} alt="Fiusac logo" />
            </div>
          </Link>
          <Link to="/noticias">
            <div id="feedsBanner">
              <div>
                <h4>Portal ingeniería</h4>
                <p>Puedes ver noticias sobre la facultad y también del portal de ingeniería</p>
              </div>
              <img src={FiusacLogo} alt="Fiusac logo" />
            </div>
          </Link>
        </div>
      </div>
    )
  }
}

export default Home;