import React, { Component } from "react";
import firebase, { auth } from "firebase";
import { Redirect } from 'react-router-dom';
import ShowMsg from '../Alert/Alert';
import * as firebaseui from 'firebaseui-es';
import './Login.css';

const firebaseConfig = {
    apiKey: "AIzaSyB1MPonpuvCFF9igWdr1-KTVV43i3I17e8",
    authDomain: "fiusac.web.app",
    databaseURL: "https://fiusac.firebaseio.com",
    projectId: "fiusac",
    storageBucket: "fiusac.appspot.com",
    messagingSenderId: "980983277469",
    appId: "1:980983277469:web:980611419493b3cc"
};
firebase.initializeApp(firebaseConfig);

const uiConfig = {
    signInSuccessUrl: '/horario',
    signInFlow: 'popup',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        {
            provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
            forceSameDevice: false,
            signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD
          }
    ]
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

class Login extends Component {
    constructor(props){
        super(props);
        this.state = { redir: false };
    }
    componentDidMount() {
        ui.start('#loginCont', uiConfig);


        const visible = document.querySelector('.visible');
        const pass = document.getElementById('pass');
        let visibleToggle = true;

        //Hide and Show pass
        visible.addEventListener('click', ()=>{
            if(visibleToggle){
                pass.type = "text";
                visible.textContent = "visibility";
                visibleToggle = false;
            }
            else{
                pass.type = "password";
                visible.textContent = "visibility_off";
                visibleToggle = true;
            }
        })
        //Show Alerts
        const Alert = new ShowMsg();
        Alert.init();
        
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.addEventListener('click', () =>{
            const mail = document.getElementById('mail');
            auth().signInWithEmailAndPassword(mail.value, pass.value)
            .then(() =>{
                this.setState({redir:true});
            })
            .catch(err => {
                const errType = err.code==="auth/invalid-email"?"El correo electrónico no es valido, verifica tu entrada o intenta de nuevo":err.code==="auth/wrong-password"?"El correo electrónico o la contraseña son incorrectos, verifica tu entrada.":err.message;
                Alert.showMsg({
                    title: 'Ocurrio un error', 
                    body: errType, 
                    type: "error"
                })
                console.log(err);
            });
        })
    }
    render() {
        return (
            <div id='logCont'>
                <div id="logBanner">
                    <h4>Saca el máximo provecho</h4>
                    <p>Tener una cuenta en la aplicación, tiene muchos beneficios, como notificaciones, grupos privados, y mas.</p>
                </div>
                <div id="logForm">
                    <h4>Explora las posibilidades</h4>
                    <p>Ingresa con tu correo y contraseña, si no tienes una cuenta puedes crear una con redes sociales.</p>
                    <div class="input-field col s6" id="emm">
                        <i class="material-icons prefix">account_circle</i>
                        <input id="mail" type="email" class="validate" />
                        <label for="mail">Correo</label>
                        <span class="helper-text" data-error="invalido" data-success="valido">Email de la cuenta</span>
                    </div>
                    <div class="input-field col s6">
                        <i class="material-icons prefix">lock</i>
                        <input id="pass" type="password" class="validate" />
                        <i className="material-icons visible">visibility_off</i>
                        <label for="pass">Contraseña</label>
                        <span class="helper-text" data-error="invalido" data-success="valido">Caracteres clave</span>
                    </div>
                    <button id="loginBtn" className="waves-effect"><i className='material-icons'>email</i> Iniciar sesión</button>
                </div>
                <span id="logSep">o</span>
                <div id="loginCont"></div>
                {this.state.redir !== false ? <Redirect to='/horario' /> : ''}
            </div>
        )
    }
}

export default Login;