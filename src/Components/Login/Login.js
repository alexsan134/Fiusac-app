import React, { Component } from "react";
import { auth } from "firebase/app";
import { firedb, dataHandler, UserTime } from "../../Functions.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebookF, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Redirect } from 'react-router-dom';
import ShowMsg from '../Alert/Alert';
import M from "materialize-css/dist/js/materialize.min.js";
import './Login.css';


//Send toast
function loginSingle(data) {
    if (data.val()) {
        const uidKey = Object.keys(data.val());
        let res = data.val()[uidKey[0]];
        if (!res) res = data.val();
        if (uidKey.length > 1) res = data.val();

        dataHandler(res, 4).then(() => console.log("Save user"))
            .catch(err => console.log("User creation error ", err));
        if (res.courses) {
            dataHandler(res.courses, 5).then(() => {
                M.toast({ html: `Sesión iniciada correctamente` })
                return 0;
            })
        } else {
            dataHandler({}, 6);
            M.toast({ html: `Sesión iniciada correctamente` })
            return 0;
        }
    }
}

async function sendToast(user, dsp, uis) {
    if (user) {
        let photo = user.photoURL ? user.photoURL : "https://firebasestorage.googleapis.com/v0/b/fiusac.appspot.com/o/default.jpg?alt=media&token=deb24fd8-e895-466a-91ba-513fdfdfef3c";
        if (user.providerData[0].providerId === "facebook.com") photo += "?type=large";
        const data = {
            uid: user.uid,
            carnet: uis ? uis : "",
            name: user.displayName ? user.displayName : dsp,
            providerId: user.providerData[0].providerId,
            email: user.email,
            photo,
            cover: "https://images.unsplash.com/photo-1565895124887-851fcc855bc3?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=700&h=500&fit=crop&ixid=eyJhcHBfaWQiOjF9"
        };

        if (user.providerData[0].providerId !== "facebook.com" && user.emailVerified === false) {
            user.sendEmailVerification()
                .then(() => {
                    console.log("Send verification email")
                })
                .catch(err => console.log(err))
        }
        //Set DataBase
        if (UserTime(user) === "new") {
            user.updateProfile({
                photoURL: photo,
                displayName: dsp
            })
            firedb.ref("users/" + user.uid).set(data);
            dataHandler(data, 4).then(() => console.log("Save new user"))
                .catch(err => console.log("User creation error ", err));
        } else {
            firedb.ref("users/" + user.uid).once('value', data => loginSingle(data));
            dataHandler(data, 4).then(() => console.log("Save user"))
                .catch(err => console.log("User creation error ", err));
        }
    }
}

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = { redir: false };
        this.isSafe = false;
    }

    componentDidMount() {
        this.isSafe = true;
        //providers
        auth().languageCode = "es";
        const googleProv = new auth.GoogleAuthProvider();
        const fbProv = new auth.FacebookAuthProvider();
        fbProv.setCustomParameters({ 'display': 'popup' });

        //Inputs
        const visible1 = document.querySelector('.visible1');
        const visible2 = document.querySelector('.visible2');
        let username = document.getElementById("username");
        let pass = document.getElementById('pass');
        let passSigin = document.getElementById("passSigin");
        let uis = document.getElementById("uis");
        M.CharacterCounter.init(uis);

        const forgotBtn = document.getElementById("forgotPassword");
        const createAccount = document.getElementById("createAccount");
        const validAccount = document.getElementById("validAccount");
        const loginGroup = document.getElementById("loginGroup");
        const siginGroup = document.getElementById("siginGroup");
        const loginBtn = document.getElementById('loginBtn');
        const googleLog = document.getElementById("googleLog");
        const facebookLog = document.getElementById("facebookLog");

        const crt = this;
        let visible1Toggle = true;
        let visible2Toggle = true;
        let loginBtnFunction = true;

        //Change for sigin
        createAccount.addEventListener('click', () => {
            loginGroup.style.opacity = 0;
            loginGroup.style.height = "0px";
            siginGroup.style.height = "400px";
            siginGroup.style.opacity = 1;
            loginBtn.innerHTML = "<i class='material-icons'>assignment</i> Crear cuenta";
            loginBtnFunction = false;
        })

        validAccount.addEventListener('click', () => {
            siginGroup.style.opacity = 0;
            siginGroup.style.height = "0px";
            loginGroup.style.height = "245px";
            loginGroup.style.opacity = 1;
            loginBtn.innerHTML = "<i class='material-icons'>assignment_ind</i> Iniciar sesión"
            loginBtnFunction = true;
        })

        //Hide and Show pass
        visible2.addEventListener('click', () => {
            if (visible2Toggle) {
                passSigin.type = "text";
                visible2.textContent = "visibility";
                visible2Toggle = false;
            }
            else {
                passSigin.type = "password";
                visible2.textContent = "visibility_off";
                visible2Toggle = true;
            }
        })

        visible1.addEventListener('click', () => {
            if (visible1Toggle) {
                pass.type = "text";
                visible1.textContent = "visibility";
                visible1Toggle = false;
            }
            else {
                pass.type = "password";
                visible1.textContent = "visibility_off";
                visible1Toggle = true;
            }
        })

        //Forgot password
        forgotBtn.addEventListener("click", () => {
            Alert.showMsg({
                title: 'Recupera tu contraseña',
                body: 'Te enviaremos un mensaje a tu correo con un link para recuperar tu contraseña',
                type: "input",
                placeholder: "Correo electrónico",
                onConfirm: text => {
                    if (text.length > 5) {
                        auth().sendPasswordResetEmail(text);
                        M.toast({ html: 'Mensaje enviado correctamente' })
                    }
                }
            })
        })

        //Show Alerts
        const Alert = new ShowMsg();
        function loginEvent() {
            if (loginBtnFunction) {
                username = document.getElementById("username");
                pass = document.getElementById('pass');
                let errCounter = 0;
                const userPs = username.value.trim();
                const getData = data => {
                    if (data.val()) {
                        const uidKey = Object.keys(data.val());
                        auth().signInWithEmailAndPassword(data.val()[uidKey[0]].email, pass.value.trim())
                            .then(user => loginSingle(data))
                            .catch(err => {
                                Alert.showMsg({
                                    title: "Contraseña incorrecta",
                                    body: `${data.val()[uidKey[0]].name} tu contraseña no es correcta o se utilizando para otra cuenta como google o facebook, si no la recuerdas puedes recuperarla con un link a tu correo.`,
                                    type: "error"
                                })
                            })
                    }
                    else errCounter++;
                    if (errCounter === 3) {
                        Alert.showMsg({
                            title: "Usuario no valido",
                            body: "No encontramos ninguna cuenta que cumpliera con el carnet o nombre de usuario.",
                            type: "error"
                        })
                    }
                }
                try {
                    firedb.ref("users").orderByChild("carnet").equalTo(userPs).limitToFirst(1).once('value', userData => getData(userData));
                    firedb.ref("users").orderByChild("name").equalTo(userPs).limitToFirst(1).once('value', userData => getData(userData));
                    firedb.ref("users").orderByChild("email").equalTo(userPs).limitToFirst(1).once('value', userData => getData(userData));
                }
                catch (err) {
                    console.log("Error ", err);
                }
            } else {
                const mail = document.getElementById('mail');
                uis = document.getElementById("uis");
                const usernameSigin = document.getElementById("usernameSigin");
                passSigin = document.getElementById("passSigin");

                const formData = {
                    mail: mail.value.trim(),
                    user: usernameSigin.value.trim(),
                    pass: passSigin.value.trim(),
                    uis: uis.value.trim()
                }
                if (formData.mail.length > 0 && formData.user.length > 0 && formData.pass.length > 0 && (formData.uis.length > 0 && formData.uis.length <= 9)) {
                    auth().createUserWithEmailAndPassword(mail.value, passSigin.value)
                        .then(user => {
                            sendToast(user.user, formData.user, formData.uis)
                                .then(data => {
                                    M.toast({ html: `Sesión iniciada correctamente` });
                                    if (crt.isSafe) crt.setState({ redir: true });
                                })
                        })
                        .catch(err => {
                            console.log(err);
                            const errMsg = err.code === "auth/weak-password" ? "Tu contraseña debe contener al menos 6 caracteres ( Requerido ), una mayuscula y al menos un numero ( Recomendado )." : err.code === "auth/invalid-email" ? "El correo que ingresaste parece ser no valido para crear tu cuenta." : err.code === "auth/email-already-in-use" ? "Este correo ya se esta utilizando en otra cuenta, intenta iniciar sesión." : err;
                            Alert.showMsg({
                                title: "Ocurrio un error",
                                body: errMsg,
                                type: "error"
                            })
                        })
                } else {
                    if (formData.uis.length > 0) {
                        Alert.showMsg({
                            title: "Carnet no valido",
                            body: "El numero de carnet que has ingresado no esta registrado o no es valido, intenta nuevamente.",
                            type: "error"
                        })
                    } else {
                        Alert.showMsg({
                            title: "Ocurrio un error",
                            body: "Es posible que no sean validas tus entradas o tienes que llenar todos los campos, son requeridos para crear tu cuenta nueva.",
                            type: "error"
                        })
                    }
                }
            }
        }

        //Events
        loginBtn.addEventListener('click', () => loginEvent());
        googleLog.addEventListener('click', () => {
            //Google Sigin
            auth().signInWithPopup(googleProv)
                .then(res => {
                    sendToast(res.user).then(data => {
                        if (crt.isSafe) crt.setState({ redir: true });
                    })
                }).catch(err => {
                    console.log("Google sigin", err);
                })
        })
        facebookLog.addEventListener("click", () => {
            //Facebook Sigin
            auth().signInWithPopup(fbProv)
                .then(res => {
                    sendToast(res.user).then(data => {
                        if (crt.isSafe) crt.setState({ redir: true });
                    })
                }).catch(err => {
                    console.log("Google sigin", err);
                })
        })
    }
    componentWillUnmount() {
        firedb.ref("users").off('value');
        this.isSafe = false;
    }
    render() {
        return (
            <div id='logCont'>
                <div id="logBanner">
                    <h4>Saca el máximo provecho</h4>
                    <p>Tener una cuenta en la aplicación, tiene muchos beneficios, registrate ahora.</p>
                </div>
                <div id="logForm">
                    <h4>Explora las posibilidades</h4>
                    <p>Ingresa con tu correo y contraseña, si no tienes una cuenta puedes crear una con redes sociales.</p>
                    <div id="siginGroup">
                        <div className="input-field col s6" id="emm">
                            <i className="material-icons prefix">email</i>
                            <input id="mail" type="email" className="validate" autoComplete="off" required="" aria-required="true" />
                            <label htmlFor="mail">Correo</label>
                            <span className="helper-text" data-error="Correo invalido" data-success="Correo aceptado">Email de la cuenta</span>
                        </div>
                        <div className="input-field col s6" id="carnet">
                            <i className="material-icons prefix">account_balance</i>
                            <input id="uis" type="number" className="validate" autoComplete="off" data-length="9" required="" aria-required="true" />
                            <label htmlFor="uis">Carnet</label>
                            <span className="helper-text" data-error="Carnet invalido" data-success="Carnet valido">Numero de carnet</span>
                        </div>
                        <div className="input-field col s6" id="carnet">
                            <i className="material-icons prefix">account_box</i>
                            <input id="usernameSigin" type="text" className="validate" autoComplete="off" required="" aria-required="true" />
                            <label htmlFor="usernameSigin">Usuario</label>
                            <span className="helper-text" data-error="Nombre de usuario invalido" data-success="Nombre de usuario valido">Nombre de usuario</span>
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">lock</i>
                            <input id="passSigin" type="password" className="validate" autoComplete="off" minLength="6" required="" aria-required="true" />
                            <label htmlFor="passSigin">Contraseña</label>
                            <i className="material-icons visible visible2">visibility_off</i>
                            <span className="helper-text" data-error="Contraseña debil" data-success="Contraseña aceptada">Caracteres clave</span>
                        </div>
                        <span className="alreadyAccount alr3">¿Ya tienes una cuenta? <button id="validAccount">Iniciar sesion</button></span>
                    </div>

                    <div id="loginGroup">
                        <span className="alreadyAccount">¿No tienes una cuenta? <button id="createAccount">Crear cuenta</button></span>
                        <div className="input-field col s6" id="carnet">
                            <i className="material-icons prefix">account_box</i>
                            <input id="username" type="text" autoComplete="off" required="" aria-required="true" />
                            <label htmlFor="username">Carnet | Usuario | Correo</label>
                            <span className="helper-text" data-error="invalido" data-success="valido">Cualquier valor de usuario</span>
                        </div>
                        <div className="input-field col s6">
                            <i className="material-icons prefix">lock</i>
                            <input id="pass" type="password" autoComplete="off" required="" aria-required="true" />
                            <label htmlFor="pass">Contraseña</label>
                            <i className="material-icons visible visible1">visibility_off</i>
                            <span className="helper-text" data-error="invalido" data-success="valido">Caracteres clave</span>
                            <span id="forgotPassword">¿Olvidaste tu contraseña? <button id="forgotBtn">Recuperar contraseña</button></span>
                        </div>
                    </div>
                    <button id="loginBtn" className="waves-effect"><i className='material-icons'>assignment_ind</i> Iniciar sesion</button>
                </div>
                <span id="logSep">tambien puedes</span>
                <div id="socialLogin">
                    <button id="googleLog" className="btn waves-effect"><FontAwesomeIcon icon={faGoogle} />&nbsp;&nbsp;Iniciar sesion con Google</button>
                    <button id="facebookLog" className="btn waves-effect"><FontAwesomeIcon icon={faFacebookF} />&nbsp;&nbsp;Iniciar sesion con Facebook</button>
                </div>
                {this.state.redir !== false ? <Redirect to='/horario' /> : ''}
            </div>
        )
    }
}

export default Login;