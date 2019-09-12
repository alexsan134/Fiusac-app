import React, { Component } from "react";
import { withRouter, Link } from 'react-router-dom';
import ShowMsg from '../Alert/Alert';
import firebase from "firebase/app";
import "firebase/auth";
import M from 'materialize-css/dist/js/materialize.min.js';
import './Navbar.css';
import Tutorial from '../Tutorial/Tutorial';
import CourseData from '../Calendar/courses.json';
import Floating from '../Floating/Floating';
import { UserTime, firedb, dataHandler } from '../../Functions';

const Alert = new ShowMsg();
const auth = firebase.auth;

class Navbar extends Component {
  constructor(props) {
    super(props);

    //Global Functions
    this.openSearch = this.openSearch.bind(this);
    this.closeTut = this.closeTut.bind(this);
    this.senEmail = this.senEmail.bind(this);
    this.shareCourses = this.shareCourses.bind(this);
    this.saveToCloud = this.saveToCloud.bind(this);
    this.state = { tut: false, redir: false, validUser: null, user: null }
    this.currentUser = "";

    //Set autocomplete data
    this.courses = {};
    CourseData.map(e => {
      if (e.nombre !== undefined && e.nombre.length > 2) this.courses[e.nombre.toLowerCase()] = null;
      if (e.catedratico !== undefined && e.catedratico.length > 2) this.courses[e.catedratico.toLowerCase()] = null;
      if (e.codigo !== undefined && e.codigo.length > 0) this.courses["Código " + e.codigo] = null;
      if (e.seccion !== undefined && e.seccion.length > 0) this.courses["Sección " + e.seccion] = null;
      if (e.edificio !== undefined && e.edificio.length > 0) this.courses["Edificio " + e.edificio] = null;
      if (e.salon !== undefined && e.salon.length > 0) this.courses["Salón " + e.salon + " del Edificio " + e.edificio] = null;
      if (e.horaInicio !== undefined && e.horaInicio.length > 0) this.courses["Empieza a las " + e.horaInicio + " termina a las " + e.horaFinal] = null;
      return 0
    });
  }

  saveToCloud() {
    const user = auth().currentUser ? auth().currentUser : null;
    dataHandler({}, 2).then(data => {
      if (user) {
        if (data.length === 0) {
          Alert.showMsg({
            title: "Sin cursos",
            body: "No tienes cursos agregados aun, puedes agregar todos los cursos que quieras utilizando el buscador",
            type: "error"
          });
        }
        else {
          dataHandler({}, 7).then(user => {
            firedb.ref(`users/${user[0].uid}/courses`).set(data, () => {
              M.toast({ html: 'Cursos guardados correctamente' });
            });
          })
        }
      } else {
        Alert.showMsg({
          title: "Inicio de sesión",
          body: "Para poder acceder a esta y a otra opciones primero debes iniciar sesión en la aplicación, es gratis!",
          type: "error"
        });
      }
    })
  }

  shareCourses() {
    const user = auth().currentUser ? auth().currentUser : null;
    if (user) {
      Alert.showMsg({
        title: "Compartir cursos",
        body: 'Para compartir tus cursos solo busca por numero de carnet o por correo, puedes buscar usuarios aquí:',
        placeholder: 'Carnet o email de amigo',
        succesText: "Importar",
        type: "input",
        onConfirm: (value) => {
          dataHandler({}, 7).then(userDats => {
            if (userDats[0].carnet.trim() === value.trim() || userDats[0].email.trim() === value.trim()) {
              setTimeout(() => {
                Alert.showMsg({
                  title: "Recurrencia",
                  body: "¿Estas tratando de importar tus propios cursos? Si tienes algún problema solo recarga la aplicación deslizando hacia abajo.",
                  type: "error"
                });
              }, 300);
            }
            else {
              let mainRef = "";
              if(isNaN(parseInt(value))) mainRef = "email";
              else mainRef = "carnet";

              firedb.ref("users").orderByChild(mainRef).equalTo(value.trim()).limitToFirst(1).once("value", data => {
                setTimeout(() => {
                  if (data.val()) {
                    const userKey = Object.keys(data.val());
                    if (data.val()[userKey[0]].courses)
                      Alert.showMsg({
                        title: "¿Deseas importarlos?",
                        body: `
                      <div id="profileContainerShare">
                        <div id="shareCircle">
                          <img src='${data.val()[userKey[0]].photo}' alt='Profile'/>
                        </div>
                        <div id="contentShare">
                          <h4>${data.val()[userKey[0]].name}</h4>
                          <span>${data.val()[userKey[0]].email}</span>
                          <span>Total de cursos: ${data.val()[userKey[0]].courses.length}</span>
                        </div>
                      </div>
                      `,
                        type: "confirmation",
                        onConfirm: () => {
                          data.val()[userKey[0]].courses.map((e, i) => {
                            return dataHandler(e).then(item => {
                              if (i === data.val()[userKey[0]].courses.length - 1) {
                                firedb.ref("users/" + user.uid + "/courses").set(item);
                              }
                            });
                          })
                          M.toast({ html: 'Cursos importados exitosamente' })
                        }
                      });
                    else {
                      Alert.showMsg({
                        title: "Sin cursos",
                        body: `Lo sentimos pero ${data.val()[userKey[0]].name} aun no tiene cursos agregados a su cuenta, intenta de nuevo mas tarde.`,
                        type: "error"
                      });
                    }
                  } else {
                    Alert.showMsg({
                      title: "Usuario no encontrado",
                      body: "La búsqueda ingresada no es correcta o no existe ninguna cuenta con ese numero de carnet o email, lo sentimos.",
                      type: "error"
                    });
                  }
                }, 300);
              })
            }
          })
        }
      });
    } else {
      Alert.showMsg({
        title: "Inicio de sesión",
        body: "Para poder acceder a estas opciones primero debes iniciar sesión en la aplicación.",
        type: "error"
      });
    }
  }

  //Send verify Email
  senEmail() {
    if (auth().currentUser !== null) {
      auth().currentUser.sendEmailVerification()
        .then(() => {
          M.toast({ html: 'Correo de verificación enviado' })
        })
        .catch(err => console.log(err))
    }
    this.setState({
      user: null
    })
  }

  //Close tutorial event
  closeTut() {
    const tuts = document.getElementById('tuto');
    const closeT = document.querySelector('.closeT');
    closeT.classList.add('hide');
    tuts.style.opacity = 0;
    closeT.style.opacity = 0;
    setTimeout(() => this.setState({ tut: false }), 300);
  };

  //Open search input
  openSearch() {
    //Select input field
    const cont = document.getElementById('search-container');
    const inp = document.getElementById('search-input');
    const shadow = document.getElementById('searchShadow');
    inp.value = '';
    cont.style.display = "block";
    shadow.style.display = "block";
    cont.style.opacity = 1;
    inp.style.display = "block";
    setTimeout(() => shadow.style.opacity = 1, 10);
    setTimeout(() => inp.setAttribute('placeholder', 'Buscar cursos'), 200);
    inp.focus();
  }

  componentDidMount() {
    //Containers and animations
    const drop = document.querySelectorAll('.dropdown-trigger')
    const cont = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const shadow = document.getElementById('searchShadow');
    const opTut = document.getElementById('opTut');
    const closeT = document.querySelector('.closeT');
    const searchLink = document.getElementById("searchLink");

    //Init autocomplete
    M.Dropdown.init(drop);
    M.Autocomplete.init(searchInput, { data: this.courses, minLength:2 });

    //Hide search function
    function hideSearch() {
      searchInput.style.display = "none";
      searchInput.setAttribute('placeholder', '')
      shadow.style.opacity = 0;
      setTimeout(() => {
        cont.style.display = "none";
        shadow.style.display = "none";
      }, 200);
    }

    //Check for user
    auth().onAuthStateChanged(user => {
      setTimeout(() => {
        this.currentUser = user ? "" : "Iniciar sesión";
        this.setState({
          user: user ? user : null,
          validUser: user ? user.emailVerified : false
        })
      }, 10);
    })

    //Listen for route changes
    this.props.history.listen(location => {
      const user = auth().currentUser ? auth().currentUser : null;

      if (user && (user.providerData[0].providerId !== "facebook.com" && user.emailVerified === false)) {
        if (UserTime(user) === "older") {
          user.delete()
            .then(function () {
              M.toast({ html: 'Usuario borrado, lo sentimos' })
            })
            .catch(function (error) {
              console.log('Error deleting user:', error);
            });
        }
      }
      this.currentUser = user ? "" : "Iniciar Sesión";
      this.setState({
        user: auth().currentUser ? auth().currentUser : null,
        validUser: auth().currentUser ? auth().currentUser.emailVerified : false
      })
    });

    //Search Events
    function searchVs(){
      setTimeout(() => {
        if (searchInput.value.length > 2) {
          this.setState({ redir: `/buscar/${searchInput.value.trim()}` })
          searchLink.click();
        }
      }, 10);
    }
    searchInput.addEventListener('focusout', () => hideSearch());
    searchInput.addEventListener('change', () => searchVs());
    searchInput.addEventListener('search', () => searchVs());


    //Open tutorial
    opTut.addEventListener('click', () => {
      this.setState({ tut: true });
      setTimeout(() => closeT.style.opacity = 1, 10);
    })
  }

  render() {
    //Update state to show tutorial
    const { location } = this.props
    const paths = location.pathname.substr(1);
    let color;
    const pathsRes = paths.includes("buscar") ? paths.substr(7) : paths === "" ? " " : paths === "cuenta" ? this.currentUser : paths === "signin" ? "Registrarse" : paths;
    let tutComp = ' ';
    if (this.state.tut) tutComp = (<Tutorial />);
    if (pathsRes === "") {
      if (this.state.user !== null && this.state.validUser === false && this.state.user.providerData[0].providerId !== "facebook.com") color = "blue";
      else color = "transBar";
    }if(pathsRes === " "){
      color="welcome"
    }
    return (
      <div>
        <nav className={color}>
          <a className="brand truncate" href="./"><span>{pathsRes === "" ? color === "blue" ? "Verificar correo" : "" : pathsRes}</span></a>
          <div className="nav-wrapper">
            <span data-target="side1" className="nbtn sidenav-trigger waves-effect">
              <i className="material-icons">menu</i>
            </span>
            <span className="nbtn right waves-effect dropdown-trigger" data-target='dropdown1'>
              <i className="material-icons">more_vert</i>
            </span>
            <span className="nbtn right waves-effect" onClick={this.openSearch}>
              <i className="material-icons">search</i>
            </span>
            <div className="input-field" id="search-container">
              <input id="search-input" type="search" />

              <i className="material-icons" id="sendSearch">search</i>
              <i className="material-icons" id="backSearch">arrow_back</i>
            </div>
          </div>
          <div id="searchShadow"></div>
          <ul id='dropdown1' className='dropdown-content z-depth-3'>
            <li id="opTut"><span className="black-text waves-effect">Información</span></li>
          </ul>
        </nav>
        <Floating icon="add" action={this.openSearch} cloud={this.saveToCloud} share={this.shareCourses} />
        <i className={this.state.tut ? "material-icons closeT" : "hide closeT"} onClick={this.closeTut}>close</i>
        {tutComp}
        {this.state.user !== null ? this.state.validUser === false ? this.state.user.providerData[0].providerId !== "facebook.com"? (
          <div id="verifyEmail" className={this.props.location.pathname.substr(1) === ""?"homeAlert":""}>
            <span><i className="material-icons">info_outline</i> Si deseas seguir utilizando la applicación necesitamos verifcar tu identidad, te enviamos un correo de verificación para que puedas seguir utilizando FIUSAC.app®.</span>
            <button className='waves-effect' onClick={this.senEmail}><i className="material-icons">send</i> Enviar correo de nuevo</button>
          </div>
        ) : '' : '': ''}
        <Link to={this.state.redir ? this.state.redir : ""} id="searchLink">Goto</Link>
      </div>
    )
  }
}

export default withRouter(Navbar);