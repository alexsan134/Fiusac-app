import React, { Component } from 'react';
import SwipeListener from 'swipe-listener';
import Course from '../Course/Course';
import gest from './gesture.png';
import './Tutorial.css';

class Tutorial extends Component {
  constructor(props) {
    super(props)
    this.items = 0;
  }

  componentDidMount() {
    //Select elements
    const tut = document.getElementById('tuto');
    const cont = document.querySelector('.cont');
    const dots = document.getElementById('dots');
    this.items = cont.childNodes.length - 1;
    let current = 0;

    //Animation
    setTimeout(() => tut.style.opacity = 1, 10);
    dots.childNodes[current].childNodes[0].classList.add('currentDot');

    //Init Swipe
    SwipeListener(tut);

    tut.addEventListener('swipe', e => {
      const dir = e.detail.directions;
      if (dir.left) current++;
      if (dir.right) current--;
      if (current <= 0) current = 0;
      if (current >= this.items) current = this.items;
      cont.style.left = `-${current}00%`;
      for (let i = 0; i < this.items + 1; i++) {
        if (dots.childNodes[i]) dots.childNodes[i].childNodes[0].classList.remove('currentDot');
      }
      if (dots.childNodes[current]) dots.childNodes[current].childNodes[0].classList.add('currentDot');
    })

    this.setState({});
  }
  render() {
    //Tutorial dots
    const lis = [];
    for (let i = 0; i < this.items + 1; i++) {
      lis.push(<li key={i}><i className="material-icons">lens</i></li>);
    }

    return (
      <div id="tuto">
        <div className="cont">
          <div className="item">
            <h5>Cursos</h5>
            <hr></hr>
            <h4>Comportamiento</h4>
            <p>Cada curso cambia su color en su estado actual, los colores se interpretan de la siguiente manera:</p>
            <ul>
              <li><span className="bls">Inactivo</span> Indica un curso no próximo en el tiempo o ya finalizado.</li>
              <li><span className="yls">Próximo</span> Indica un curso que esta por empezar en menos de 10 minutos.</li>
              <li><span className="gls">Activo</span> Indica el curso actual según hora de inició en su intervalo de tiempo.</li>
            </ul>
            <hr></hr>
            <h4>Navegación</h4>
            <p>Si deseas navegar en el calendario solo desliza en cualquier parte de el horario, cada curso simula el dia en el que navegues.</p>
            <Course
              name='Nombre | Curso'
              timeStart='Inicio'
              timeEnd='Final'
              room='N#'
              build='T-7'
              section='#'
              prof='Nombre de Catedrático'
              days={[true, true, true, true, true, true, true]}
              today={new Date()}
              updateCourse={() => console.log("Updated")}
              count={1}
            />
            <img src={gest} alt="Swipe Gesture" id="gest" />
            <div id="block"></div>
          </div>
          <div className="item bs">
            <h5>Buscador</h5>
            <hr></hr>
            <p className="ft">Puedes buscar por: nombre, sección, docente, código, salón, edificio, hora, lugar, etc.<br /> para acceder a la búsqueda avanzada debes escribir en el siguiente formato:</p>
            <p><span>Sección</span> "numero de sección"</p>
            <p><span>Código</span> "numero de código"</p>
            <p><span>Edificio</span> "nombre del edificio"</p>
            <p><span>Salón</span> "nombre del salón" <span>del</span> "nombre del edificio"</p>
            <p><span>Empieza a las</span> "inicio (hh:mm)" <span>termina a las</span> "final (hh:mm)"</p>
            <div className="add">
              <i className="material-icons">info_outline</i><span> Información importante</span><br />
              <span>La búsqueda avanzada solo funciona si escribes el formato exactamente como se muestra, incluyendo acentos, y no agregues signos de puntuación como "_ - , :" etc. Intenta ser especifico y busca palabras con no menos de 3 letras.</span>
            </div>
          </div>
        </div>
        <ul id="dots">
          {lis}
        </ul>
      </div>
    )
  }
}
export default Tutorial;
