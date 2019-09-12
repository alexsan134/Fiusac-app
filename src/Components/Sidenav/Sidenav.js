import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import M from "materialize-css/dist/js/materialize.min.js";
import ShowMsg from '../Alert/Alert';
import { auth } from "firebase/app";
import 'materialize-css/dist/css/materialize.min.css';
import './Sidenav.css';
import { dataHandler } from "../../Functions";

class Sidenav extends Component {
  constructor(props) {
    super(props)
    this.state = { user: undefined };
  }

  componentDidMount() {
    //Usign Alert
    const Alert = new ShowMsg();

    //Init side nav
    const list = document.querySelector('.sidenav');
    const sBtn = document.querySelectorAll('.mBtn');
    const shareBtn = document.querySelector(".shareBtn");
    const s = M.Sidenav.init(list);
    const current = this;

    //Check route to add active className
    function addActive(rr) {
      const max = sBtn.length;
      for (let i = 0; i < max; i++) {
        //Check route
        const text = sBtn[i].textContent.split(' ')[1].toLowerCase();
        sBtn[i].classList.remove('active');
        sBtn[4].classList.remove('active');
        if (rr === text) sBtn[i].classList.add('active');
        else if (rr === '') sBtn[0].classList.add('active');
        else if (rr === 'cuenta') {
          sBtn[3].classList.add('active');
          sBtn[4].classList.add('active');
        }
        //Close sidenav
        s.close();
      }
    }

    //Listen for Auth
    auth().onAuthStateChanged(user => {
      const userLink = document.querySelector('.userAccount');
      const loginLink = document.querySelector('.login');
      const accountSection = document.getElementById('accountSection');
      setTimeout(() => {
        if (user === null) {
          loginLink.classList.remove('hide');
          accountSection.classList.add('hide');
          userLink.classList.add('hide');
        }
        else {
          loginLink.classList.add('hide');
          userLink.classList.remove('hide');
          accountSection.classList.remove('hide');
          dataHandler({}, 7).then(data => {
            if(data[0]) this.setState({ user: data[0].name });
          })
        }
      }, 10);
    })

    //Logout Btn
    const logoutBtn = document.querySelector('.logout');
    logoutBtn.addEventListener('click', () => {
      Alert.showMsg({
        title: "¿Estas seguro?",
        body: "Deseas cerrar sesión en este dispositivo, siempre puedes conectar cuentas gratis!",
        type: "confirmation",
        onConfirm: () => {
          auth().signOut().then(function () {
            dataHandler({}, 8);
            current.setState({ name: "" });
            M.toast({ html: 'Sesión cerrada correctamente' })
            s.close();
          }, function (error) {
            M.toast({ html: error })
          });
        }
      })
    })

    //Listen for route changes                                     
    this.props.history.listen(location => addActive(location.pathname.substr(1)));

    //Share application
    shareBtn.addEventListener("click", () => {
      if (navigator.share) {
        navigator.share({
          title: 'FIUSAC Horario',
          text: 'Prueba esta aplicacion ✨👌!',
          url: window.location.origin
        })
          .then(() => console.log('Successfully share'))
          .catch((error) => console.log('Error sharing', error));
      } else {
        let inputCp = document.createElement("input");
        inputCp.value = `Prueba esta aplicacion 📚! ${window.location.origin}`;
        document.body.appendChild(inputCp);
        inputCp.select();
        document.execCommand("copy");

        Alert.showMsg({
          title: "Gracias por compartir 📚",
          body: "Puedes ver en tu portapapeles la url de la applicacion para compartirla.",
          type: "alert"
        })

        document.body.removeChild(inputCp);
        inputCp = undefined;
      }
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
      addBtn.style.display = 'flex';
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
      <ul className="sidenav" id="side1">
        <li>
          <div className="user-view">
            <span role="button" className="userInfo">
              <span className="name">FIUSAC.app®</span>
              <span className="email">Version beta v0.83<br />Dev. Alex Santos</span>
            </span>
          </div>
        </li>
        <Link to="/">
          <li className="sBtn mBtn waves-effect">
            <i className="material-icons">home</i>
            <span> Inicio</span>
          </li>
        </Link>
        <Link to="/noticias">
          <li className="sBtn mBtn waves-effect">
            <i className="material-icons">style</i>
            <span> Noticias</span>
          </li>
        </Link>
        <Link to="/horario">
          <li className="sBtn mBtn waves-effect">
            <i className="material-icons">today</i>
            <span> Horario</span>
          </li>
        </Link>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a href="#div" className="subheader disable">Aplicación</a>
        </li>
        <Link to='/cuenta' className="login">
          <li className="sBtn mBtn waves-effect">
            <i className="material-icons">person</i>
            <span>Iniciar sesión</span>
          </li>
        </Link>
        <Link to='/cuenta'>
          <li className="sBtn mBtn userAccount waves-effect">
            <i className="material-icons">person</i>
            <span> {this.state.user}</span>
          </li>
        </Link>
        <div id="accountSection" className="hide">
          <li className="sBtn mBtn logout waves-effect">
            <i className="material-icons">exit_to_app</i>
            <span id="logout">Cerrar sesión</span>
          </li>
        </div>
        <li className="sBtn shareBtn waves-effect" >
          <i className="material-icons">share</i>
          <span>Compartir</span>
        </li>
        <li className="sBtn add-button waves-effect">
          <i className="material-icons">arrow_downward</i>
          <span>Descargar app</span>
        </li>
      </ul>
    )
  }
}

export default withRouter(Sidenav);