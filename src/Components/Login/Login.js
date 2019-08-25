import React, { Component } from "react";
import firebase from "firebase";
import * as firebaseui from 'firebaseui-es';
import './Login.css';

const firebaseConfig = {
    apiKey: "AIzaSyB1MPonpuvCFF9igWdr1-KTVV43i3I17e8",
    authDomain: "fiusac.web.com",
    databaseURL: "https://fiusac.firebaseio.com",
    projectId: "fiusac",
    storageBucket: "fiusac.appspot.com",
    messagingSenderId: "980983277469",
    appId: "1:980983277469:web:980611419493b3cc"
};
firebase.initializeApp(firebaseConfig);

const uiConfig = {
    signInSuccessUrl: '/horario',
    signInOptions: [
        // Leave the lines as is for the providers you want to offer your users.
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebaseui.auth.AnonymousAuthProvider.PROVIDER_ID
    ]
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

class Login extends Component {
    componentDidMount() {
        ui.start('#loginCont', uiConfig);
    }
    render() {
        return (
            <div id='logCont'>
                <div id="logForm">
                    <h4>Explora las posibilidades</h4>
                    <p>Ingresa con tu correo y contraseña, si no tienes una cuenta puedes crear una con redes sociales.</p>
                    <div class="input-field col s6">
                        <i class="material-icons prefix">account_circle</i>
                        <input id="mail" type="email" class="validate" />
                        <label for="mail">Usuario / Correo</label>
                    </div>
                    <div class="input-field col s6">
                        <i class="material-icons prefix">lock</i>
                        <input id="pass" type="password" class="validate" />
                        <label for="pass">Contraseña</label>
                    </div>
                    <button id="loginBtn"><i className='material-icons'>email</i> Iniciar sesion</button>
                </div>
                <span id="logSep">o</span>
                <div id="loginCont"></div>
            </div>
        )
    }
}

export default Login;