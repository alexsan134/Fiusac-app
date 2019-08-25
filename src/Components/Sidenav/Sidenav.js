import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import M from "materialize-css/dist/js/materialize.min.js";
import 'materialize-css/dist/css/materialize.min.css';
import './Sidenav.css';

class Sidenav extends Component {
  componentDidMount() {
    //Init side nav
    const list = document.querySelector('.sidenav');
    const sBtn = document.querySelectorAll('.mBtn');
    const shareBtn = document.querySelector(".shareBtn");
    const s = M.Sidenav.init(list);

    //Check route to add active class
    function addActive(rr) {
      const max = sBtn.length;
      for (let i = 0; i < max; i++) {
        //Check route
        const text = sBtn[i].textContent.split(' ')[1].toLowerCase();
        sBtn[i].classList.remove('active');
        if (rr === text) sBtn[i].classList.add('active');
        else if (rr === '') sBtn[0].classList.add('active');
        else if (rr === 'login') sBtn[2].classList.add('active');
        //Close sidenav
        s.close();
      }
    }

    //Listen route changes                                     
    this.props.history.listen(location => addActive(location.pathname.substr(1)));

    //Share application
    shareBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: 'FIUSAC Horario',
          text: 'Prueba esta aplicación 😀 ',
          url: window.location
        })
          .then(() => console.log('Successfully share'))
          .catch((error) => console.log('Error sharing', error));
      } else alert('Tu navegador no es compatible');
    })

    //Styles active route
    addActive(window.location.pathname.substr(1));

    //Service worker install button
    let deferredPrompt;
    const addBtn = document.querySelector('.add-button');
    addBtn.style.display = 'none';
    window.addEventListener('beforeinstallprompt', e => {
      e.preventDefault();
      deferredPrompt = e;
      addBtn.style.display = 'block';
      addBtn.addEventListener('click', e => {
        addBtn.style.display = 'none';
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') console.log('User accepted app prompt');
          else console.log('User dismissed the app prompt');
          deferredPrompt = null;
        });
      });
    });
  }

  render() {
    return (
      <ul class="sidenav" id="side1">
        <li>
          <div class="user-view">
            <span role="button" class="userInfo">
              <span class="name">FIUSAC App</span>
              <span class="email">Version beta v0.83<br />Dev. Alex Santos</span>
            </span>
          </div>
        </li>
        <Link to="/">
          <li class="sBtn mBtn">
            <a href="#toHome" class="waves-effect">
              <i class="material-icons">home</i> Inicio
            </a>
          </li>
        </Link>
        <Link to="/horario">
          <li class="sBtn mBtn">
            <a href="#toSchedule" class="waves-effect">
              <i class="material-icons">today</i> Horario
            </a>
          </li>
        </Link>
        <li>
          <div class="divider"></div>
        </li>
        <li>
          <a href="#div" class="subheader disable">Aplicación</a>
        </li>
        <div id="accountSection">
          <li class="sBtn config">
            <a href="#c" class="waves-effect">
              <i class="material-icons">settings</i>Configuración
	            </a>
          </li>
          <li class="sBtn logout">
            <a href="#logout" id="logout" class="waves-effect">
              <i class="material-icons">logout</i>Cerrar sesión
	            </a>
          </li>
        </div>
        <Link to='/login'>
          <li class="sBtn mBtn login hide">
            <a href="#login" id="login" class="waves-effect">
              <i class="material-icons">person</i>Iniciar sesión
	          </a>
          </li>
        </Link>
        <li class="sBtn shareBtn" >
          <a href="#share" class="waves-effect">
            <i class="material-icons">share</i>Compartir
	        </a>
        </li>
        <li class="sBtn download">
          <a href="#download" class="waves-effect add-button">
            <i class="material-icons">arrow_downward</i>Descargar app
	        </a>
        </li>
      </ul>
    )
  }
}

export default withRouter(Sidenav);
