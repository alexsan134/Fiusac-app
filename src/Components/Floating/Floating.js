import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Floating.css';

class Floating extends Component {
  componentDidMount() {
    const btn = document.querySelector('.action');
    btn.addEventListener('click', () => this.props.action());
  }
  render() {
    return (
      <div className="fixed-action-btn action">
        <span className={`btn-floating btn-large waves-effect z-depth-3 ${this.props.pulse ? 'pulse' : 'n'}`}>
          <i className="large material-icons">{this.props.icon}</i>
        </span>
      </div>
    )
  }
}

export default Floating;