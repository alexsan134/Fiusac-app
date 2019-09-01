import React from "react";
import { auth } from 'firebase/app';
import { dataHandler } from '../../Functions';
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
                const data = {
                    uid: user.uid,
                    name: user.displayName,
                    email: user.email,
                    providerId: user.providerData[0].providerId,
                    metadata: user.metadata,
                    photo: user.photoURL,
                    cover: "https://source.unsplash.com/Jp1jLjgo3PM/700x500"
                };
                dataHandler(data, 4).then(data => this.isSafe ? this.setState({ user: data }) : false)
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
        const email = this.state.user.email;;
        const metadata = this.state.user.metadata;
        const uid = this.state.user.uid;

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
                    <div id="info">
                        <h1 id="uid" className="truncate">{userName}#<span>{uid}</span></h1>
                        <span id="email">{provider}&nbsp;<span>{email}</span></span>
                    </div>
                </div>

            </div>
        )
    }
}

export default Profile;