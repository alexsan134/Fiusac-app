import React, { Component } from 'react';
import './Home.css';

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = { day: new Date() };
  }
  componentDidMount() {
    this.timer = setInterval(() => this.setState({ day: new Date() }), 1000);
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
    const time = day.getHours() <= 12 ? day.getHours() === 12 ? `${day.getHours()}:${pad(day.getMinutes())}pm` : `${day.getHours()}:${pad(day.getMinutes())}am` : `${(day.getHours() - 12)}:${pad(day.getMinutes())}pm`;
    return (
      <div id="homeCont">
        <div id="contHours">
          <h5>{days[day.getDay()]}, {day.getDate()} de {months[day.getMonth()]}</h5>
          <h4>{time}</h4>
        </div>
        <div id="mainMsj">
          <h4>Bienvenido</h4>
          <p>Aquí encontraras información sobre los cursos de la facultad, asi como administrar tus cursos del semestre.</p>
          <div id="logoDiv">
            <img src={process.env.PUBLIC_URL + '/img/icon.png'} alt="App icon" />
            <h4>FIUSAC App<br />
              <p>Esta aplicación es independiente de la facultad y aún se encuentra en desarrollo.</p></h4>
          </div>
        </div>
      </div>
    )
  }
}

export default Home;

