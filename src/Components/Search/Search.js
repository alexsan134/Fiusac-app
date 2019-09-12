import React, { Component } from 'react';
import Course from '../Course/Course';
import CourseExpanded from '../CourseExpanded/CourseExpanded';
import CourseData from '../Calendar/courses.json';
import 'materialize-css/dist/css/materialize.min.css';
import notFound from './boxes.png';
import './Search.css';

class Search extends Component {
  constructor(props) {
    super(props);

    //Global variables
    this.laps = new Date();
    this.current = [];
    this.content = React.createRef();
    this.setCurrent = this.setCurrent.bind(this);
  }
  componentDidMount() {
    //Page transition
    this.content.current.style.opacity = 0;
    this.content.current.style.left = "-100px";

    //Show TimeLine
    setTimeout(() => {
      this.content.current.style.transition = "all 0.3s ease";
      this.content.current.style.opacity = 1;
      this.content.current.style.left = 0;
      const timeLine = document.querySelector('.timeLine');
      setTimeout(() => timeLine.style.height = 'calc(100% - 40px)', 400);
    }, 200);
  }
  setCurrent() {
    //Search algorithm
    const k = this.props.keyword.toLowerCase();
    this.current = CourseData.map((e, i) => {
      if (k.includes('codigo') || k.includes('código')) {
        if (e.codigo.toString().includes(k.split(' ')[1])) return e;
        else return false;
      }
      else if (k.includes('seccion') || k.includes('sección')) {
        if (e.seccion.toString().toLowerCase().includes(k.split(' ')[1])) return e;
        else return false;
      }
      else if (k.includes('salon') || k.includes('salón')) {
        if (k.includes('edificio')) {
          if (e.salon.toString().includes(k.split(' ')[1]) && e.edificio.toLowerCase().includes(k.split(' ')[4].toLowerCase())) return e;
          else return false;
        }
        else if (e.salon.toString().includes(k.split(' ')[1])) return e;
        else return false;
      }
      else if (k.includes('edificio')) {
        if (e.edificio.toLowerCase().includes(k.split(' ')[1])) return e;
        else return false;
      }
      else if (k.includes('empieza')) {
        if (e.horaInicio.includes(k.split(' ')[3]) && e.horaFinal.includes(k.split(' ')[7])) return e;
        else return false;
      }
      else {
        if (e.nombre.toLowerCase().includes(k) || e.codigo.toString().includes(k) || e.seccion.toString().toLowerCase().includes(k) || e.catedratico.toLowerCase().includes(k) || e.salon.toString().includes(k) || e.edificio.toLowerCase().includes(k) || e.horaInicio.includes(k) || e.horaFinal.includes(k)) return e;
        else return false
      }
    }).filter(Boolean);
  }

  componentDidUpdate(prev, st) {
    //Update results and page transition
    if (prev.keyword !== this.props.keyword) {
      this.setCurrent()
      const timeLine = document.querySelector('.timeLine')
      timeLine.style.height = 0;
      this.content.current.style.transition = "none";
      this.content.current.style.opacity = 0;
      this.content.current.style.left = "-100px";
      setTimeout(() => {
        this.content.current.style.transition = "all 0.3s ease";
        this.content.current.style.opacity = 1;
        this.content.current.style.left = 0;
        setTimeout(() => timeLine.style.height = 'calc(100% - 40px)', 400);
      }, 200);
    }else{
      this.setCurrent();
    }
  }

  render() {
    //Get results and time information
    this.setCurrent();
    const laps = this.laps.getMilliseconds() / 1000;
    const rss = this.current.length === 1 ? 'resultado' : 'resultados';

    return (
      <div id="listOf">
        <h3 id="srcTitle" className={this.current.length === 0 ? 'hide' : 'ss'}>Resultados para cursos<br /><span>Se a encontrado {this.current.length} {rss} en {laps}s</span></h3>
        <div id={this.current.length === 1 ? 'allOneSrc' : 'allSrc'} ref={this.content}>
          <div className={this.current.length <= 1 ? 'hide timeLine' : 'timeLine'}></div>
          {this.current.map((e, i) => {
            let days = [e.domingo, e.lunes, e.martes, e.miercoles, e.jueves, e.viernes, e.sabado].map(e => { if (e === undefined) return false; else return true });
            if (this.current.length === 1) {
              return (
                <CourseExpanded
                  key={i}
                  name={e.nombre}
                  timeStart={e.horaInicio}
                  timeEnd={e.horaFinal}
                  room={e.salon}
                  build={e.edificio}
                  section={e.seccion}
                  prof={e.catedratico}
                  days={days}
                  code={e.codigo}
                  updateCourse={() => console.log("Update")}
                />)
            } else if (this.current.length > 1) {
              return (
                <Course
                  key={i}
                  name={e.nombre}
                  timeStart={e.horaInicio}
                  timeEnd={e.horaFinal}
                  room={e.salon}
                  code={e.codigo}
                  build={e.edificio}
                  section={e.seccion}
                  prof={e.catedratico}
                  count={1}
                  days={days}
                  updateCourse={() => console.log("Updated")}
                />
              )
            }
            return undefined
          })}
          <div className={this.current.length === 0 ? 'noRes' : 'hide'}>
            <img src={notFound} alt="Not found icon" />
            <div>
              <h5>Upps! no hay resultados</h5>
              <p>No se encontraron resultados, Intenta buscar algo similar o algo nuevo.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;