import React, { Component } from 'react';
import M from 'materialize-css/dist/js/materialize.min.js';
import { dataHandler } from '../../Functions';
import './CourseExpanded.css';

class CourseExpanded extends Component {
  constructor(props) {
    super(props);

    //Read from DB
    let state = { isSchedule: false };
    this.readCourses = this.readCourses.bind(this);

    //States and Refs
    this.state = state;
    this.handleCourses = this.handleCourses.bind(this);
    this.addC = React.createRef();
    this.remC = React.createRef();
  }

  readCourses() {
    dataHandler({ codeid: this.props.code + this.props.section }, 3).then(item => {
      setTimeout(() => {
        this.setState({
          isSchedule: item ? true : false
        })
      }, 200);
    })
  }

  handleCourses(e) {
    //Add course
    if (e) {
      dataHandler({ codigo: this.props.code, seccion: this.props.section, codeid: this.props.code + this.props.section })
        .then(item => {
          this.readCourses();
          M.toast({ html: 'Curso agregado exitosamente' });
        })
    }

    //Remove Course
    if (!e) {
      const data = { codeid: this.props.code + this.props.section };
      dataHandler(data, 1)
        .then(item => {
          this.readCourses();
          M.toast({ html: 'Curso eliminado exitosamente' });
        })
    }
  }
  componentDidUpdate(prev, st) {
    //Refresh handle action for courses
    if (prev.section !== this.props.section && prev.code !== this.props.code) {
      this.readCourses();
    }
  }
  componentDidMount() {
    //Add events to handler btn
    this.addC.current.addEventListener('click', () => {
      this.handleCourses(true);
      this.props.updateCourse();
    });
    this.remC.current.addEventListener('click', () => {
      this.handleCourses(false);
      this.props.updateCourse();
    });
  }

  render() {
    this.readCourses();
    //Global day names
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

    return (
      <div id="detailsContainer">
        <div id="detailsShadow"></div>
        <h1 class="titleExp">{this.props.name.toLowerCase()}</h1>
        <h6 class="docExp">{this.props.prof.toLowerCase()}</h6>
        <h6 class="secExp">Sección {this.props.section}</h6>
        <h6 class="secExp">Código {this.props.code}</h6>
        <span class={this.state.isSchedule ? 'hide addCourse' : 'btn bHand waves-effect addCourse'} ref={this.addC} ><i class="material-icons left">add</i><span class="right">Agregar curso</span></span>
        <span class={!this.state.isSchedule ? 'hide removeCourse' : 'btn bHand red waves-effect removeCourse'} ref={this.remC}><i class="material-icons left">delete</i><span class="right">Remover curso</span></span>
        <h3 class="placeExp">Tiempo:</h3>
        <p>Los días: <br /><span>{this.props.days.map((e, i) => {
          if (e) return days[i]
          return false;
        }).filter(Boolean).join(', ')}</span><br />de <span>{this.props.timeStart}</span> a <span>{this.props.timeEnd}</span>.</p>
        <h3 class="placeExp">Lugar:</h3>
        <p>En el salón <span>{this.props.room}</span> del edificio <span>{this.props.build}</span></p>
        <iframe title="Detalles" class="gmap" height="400" src={`https://maps.google.com/maps?q=Usac%20edificio%20${this.props.build}&t=&z=19&ie=UTF8&iwloc=&output=embed`} frameborder="0" scrolling="no" marginheight="0" marginwidth="0"></iframe>
      </div>
    );
  }
}

export default CourseExpanded;