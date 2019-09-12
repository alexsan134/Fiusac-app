import React from "react";
import Login from '../Login/Login';
import Profile from '../Profile/Profile';
import { auth } from "firebase/app";
import './UserManager.css';

class UserManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = { user: null };
        this.isSafe = false;

        //Preloader
        this.element = <div className="loadingUser">
            <h4>Espera solo un momento ...</h4>
            <p>Esto dependerá de la velocidad de tu conexión a internet, y solo ocurrirá cuando cierres o inicies sesión.</p>
        </div>
    }

    componentDidMount() {
        //Listen for Auth
        this.isSafe = true;
        auth().onAuthStateChanged(user => {
            this.element = user === null ? <Login /> : <Profile />;
            if (this.isSafe) this.setState({ user });
        })
    }

    componentWillUnmount() {
        this.isSafe = false;
    }

    render() {
        return (<div>{this.element}</div>)
    }
}

export default UserManager;