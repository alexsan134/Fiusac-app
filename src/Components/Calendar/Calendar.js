import React, { Component } from 'react';
import SwipeListener from 'swipe-listener';
import Logo from './fiusac.png';
import Defs from './default.png';
import CourseData from './courses.json';
import Cloud from './cloud.png';
import Empty from './empty.png';
import Course from '../Course/Course';
import { dataHandler } from '../../Functions';
import './Calendar.css';
import 'materialize-css/dist/css/materialize.min.css';

class Calendar extends Component {
  constructor(props) {
    super(props)
    //Get objects from Courses.json
    this.current = [];
    this.defControl = false;

    //Global Variables
    this.months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    this.dd = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

    //States and Refs
    this.state = { normal: new Date() }
    this.setCourses = this.setCourses.bind(this);
    this.updateCourse = this.updateCourse.bind(this);
    this.allCt = React.createRef();
    this.tuto = React.createRef();

    // Get DataBase
    this.setCourses();
  }

  updateCourse() {
    //Enter style
    this.allCt.current.style.transition = "none";
    this.allCt.current.style.opacity = 0

    //Leave style
    setTimeout(() => {
      this.allCt.current.style.transition = "all 0.45s ease";
      this.allCt.current.style.opacity = 1;
    }, 50);

    //Update Render
    this.setCourses();
  }

  setCourses() {
    //CoursesList
    this.current = [];
    dataHandler({}, 2).then(courses => {
      this.defControl = true;
      //Map courses to filter by code and section
      if (courses) {
        CourseData.map((e, p) => {
          return courses.map(i => {
            if (e.codigo === i.codigo.toString() && e.seccion === i.seccion) this.current.push(e);
            return e
          })
        })

        //Sort by time
        this.current.sort((a, b) => {
          const as = a.horaInicio.split(':');
          const bs = b.horaInicio.split(':');
          return (parseInt(as[0]) + parseInt(as[1] / 100)) - (parseInt(bs[0]) + parseInt(bs[1] / 100))
        })
        this.setState({
          normal: this.state.normal
        });
      } else return 0;
    })
  }
  componentDidMount() {
    // Select Date Text and Courses list to animate
    const mainDate = document.getElementById('mainDate');
    const all = document.getElementById('all');
    const timeLine = document.querySelector('.timeLine');
    const classAct = this;

    // Main animations
    animDate(-1);
    function animDate(dir) {
      mainDate.style.transition = "none";
      all.style.opacity = 0;
      mainDate.style.opacity = 0;
      all.style.transition = "none";
      timeLine.style.transition = "none";
      timeLine.style.height = 0;
      all.style.left = `${dir * 100}px`;
      setTimeout(() => {
        mainDate.style.transition = "opacity 0.45s ease";
        all.style.transition = "left 0.15s, opacity 0.45s";
        timeLine.style.transition = "height 0.5s ease";
        all.style.opacity = 1;
        mainDate.style.opacity = 1;
        all.style.left = 0;
      }, 150);
      setTimeout(() => timeLine.style.height = 'calc(100% - 40px)', 400);
    }

    //Add one day to date and anim courses
    function slide(e, dir) {
      e.state.normal.setDate(e.state.normal.getDate() + dir);
      animDate(dir);
      e.setCourses();
    }

    //Swipe Event
    SwipeListener(this.allCt.current);

    this.allCt.current.addEventListener('swipe', e => {
      let directions = e.detail.directions;
      if (directions.left) slide(classAct, 1);
      if (directions.right) slide(classAct, -1);
    })

    //Reset date
    mainDate.addEventListener('click', () => {
      classAct.setState({ normal: new Date() })
      animDate();
    });
  }

  render() {
    //Parse dates format
    const year = this.state.normal.getFullYear();
    const today = this.dd[this.state.normal.getDay()]
    const cMonth = this.months[this.state.normal.getMonth()];
    const tDate = this.state.normal.getDate();
    const def = this.current.length === 0 ? true : false;

    let fails = 0;
    let counter = 0;

    return (
      <div className={this.defControl ? "show" : "hide"}>
        <div ref={this.allCt} id="ctp" className={def ? 'hide' : 'show'}>
          <div id="header">
            <h3 id="mainDate" className={today === 'Miércoles' ? 'rss' : today === 'Domingo' ? 'rsd' : 'exp'}>{today} <br /><span>{cMonth} {tDate}</span></h3>
            <div id="main">
              <div id="bans">
                <img src={Logo} alt="Logo FIUSAC" />
                <h4>Facultad de<br />Ingeniería<br /><span>{this.state.normal.getMonth() > 5 ? 'Semestre II' : 'Semestre I'} {year}</span></h4>
              </div>
            </div>
          </div>
          <div id="band"></div>
          <section id='all'>
            {this.current.map((e, i) => {
              let days = [e.domingo, e.lunes, e.martes, e.miercoles, e.jueves, e.viernes, e.sabado].map(e => { if (e === undefined) return false; else return true });
              if (days[this.state.normal.getDay()]) {
                counter++;
                return (
                  <Course
                    key={i}
                    name={e.nombre}
                    timeStart={e.horaInicio}
                    timeEnd={e.horaFinal}
                    room={e.salon}
                    build={e.edificio}
                    section={e.seccion}
                    prof={e.catedratico}
                    code={e.codigo}
                    count={counter}
                    days={days}
                    updateCourse={this.updateCourse}
                  />)
              } else fails++;
              return undefined
            })}
            <div className={fails === this.current.length ? 'hide timeLine' : 'timeLine'}></div>
            <div id="emptyCourses" className={fails === this.current.length ? 'show' : 'hide'}>
              <img src={Empty} alt="Empty Courses" />
              <div>
                <h4>No tienes ningún curso asignado par hoy.</h4>
                <p>Puedes agregar mas utilizando el buscador o navegar para ver los cursos entre días.</p>
              </div>
            </div>
            <div className='rights'><p>FIUSAC.app® 2019<br />todos los derechos reservados.</p>
            </div>
          </section>
          <div id="swipeArea"></div>
        </div>
        <div className={def ? 'show defS' : 'hide'}>
          <div className="default">
            <h4>No tienes cursos asignados</h4>
            <p>Puedes agregar los cursos que quieras con solo utilizar el buscador <i className="material-icons">search</i></p>
            <div id="banner">
              <img src={Logo} alt='Default banner' />
              <span>Cursos oficiales<br />de la facultad.</span>
            </div>
          </div>
          <img className="defs" src={Defs} alt="Not found" />
          <img className="defsCc" src={Cloud} alt="Not found cloud" />
        </div>
      </div>
    );
  }
}

export default Calendar;