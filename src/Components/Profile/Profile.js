import React from "react";
import { auth } from 'firebase/app';
import { dataHandler, firedb } from '../../Functions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle, faFacebookF, } from '@fortawesome/free-brands-svg-icons';
import './Profile.css';

class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: {} };
        this.isSafe = false;
    }

    componentDidMount() {
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
                        <span id="uid">{userName}</span>
                        <span id="emailInfo" className="truncate">{provider}&nbsp;<span>{email}</span></span>
                        <button id="completeInfo" className="btn-small grey waves-effect">Completar informacion</button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Profile;