import React from "react";
import { auth } from 'firebase/app';
import './Profile.css';

class Profile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            user:{}
        };
    }

    componentDidMount(){
        auth().onAuthStateChanged(user =>{
            this.setState({ user });
        })
    }

    render(){
        const photo = this.state.user.photoURL;
        const userName = this.state.user.displayName;
        const email = this.state.user.email;
        const providerId = this.state.user.providerId;
        const metadata = this.state.user.metadata;
        const uid = this.state.user.uid;

        console.log(this.state.user.photoURL);
        return(
            <div id="profileCircle">
                <img src={photo} alt="Profile"/>
            </div>
        )
    }
}

export default Profile;