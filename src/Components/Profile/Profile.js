import React from "react";
import { auth } from 'firebase/app';
import { dataHandler, firedb } from '../../Functions';
import ShowMsg from '../Alert/Alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, } from '@fortawesome/free-brands-svg-icons';
import M from 'materialize-css/dist/js/materialize.min.js';
import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {} };
        this.isSafe = false;
    }

    componentDidMount() {
        const Alert = new ShowMsg();

        //Listen first for Auth
        this.isSafe = true;
        auth().onAuthStateChanged(user => {
            if (user) {
                firedb.ref("users/" + user.uid).on('value', data => {
                    if(data.val()){
                        dataHandler(data.val(), 4).then(data => this.isSafe ? this.setState({ user: data }) : false)
                    }
                });
            }
        })

        //Save to cloud
        const saveBtn = document.getElementById("saveToCloud");
        saveBtn.addEventListener("click", () => {
            saveBtn.classList.add("disabled");
            dataHandler({}, 2).then(data => {
                if (data.length === 0) {
                    Alert.showMsg({
                        title: "Sin cursos",
                        body: "No tienes cursos agregados aun, puedes agregar mas cursos con el buscador.",
                        type: "error"
                    });
                    saveBtn.classList.remove("disabled");
                }
                else if (this.state.user) {
                    firedb.ref("users/" + this.state.user.uid + "/courses").set(data, () => {
                        M.toast({ html: 'Cursos guardados exitosamente' });
                        saveBtn.classList.remove("disabled");
                    });
                }
            })

        })
    }

    componentWillUnmount() {
        this.isSafe = false;
    }

    render() {
        //Global Constants
        let provider;
        const photo = this.state.user.photo;
        const cover = this.state.user.cover;
        const userName = this.state.user.name;
        const email = this.state.user.email;

        //Provider Icon
        if (this.state.user.providerId === "password") provider = <i className="material-icons">email</i>
        if (this.state.user.providerId === "facebook.com") provider = <FontAwesomeIcon icon={faFacebookF} />
        if (this.state.user.providerId === "google.com") provider = <FontAwesomeIcon icon={faGoogle} />

        return (
            <div>
                <div id="cover">
                    <img src={cover} alt="" />
                </div>
                <div id="profile">
                    <div id="profileCircle">
                        <img src={photo} alt="" />
                    </div>
                    <div id="infoProfile">
                        <span id="uid">{userName}</span><br />
                        <span id="emailInfo" className="truncate">{provider}&nbsp;<span>{email}</span></span>
                    </div>
                </div>
                <div id="mainInfo">
                    <button id="saveToCloud" className="btn blue"><i className="material-icons left">cloud</i>Guardar tus cursos</button>
                </div>
            </div>
        )
    }
}

export default Profile;