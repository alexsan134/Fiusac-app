import React, { Component } from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import M from "materialize-css/dist/js/materialize.min.js";
import './Floating.css';

class Floating extends Component {
  componentDidMount() {
    var elems = document.querySelectorAll('.fixed-action-btn');
    let instance = M.FloatingActionButton.init(elems, { hoverEnabled: false });

    const searchBtn = document.querySelector('.searchBtnFab');
    searchBtn.addEventListener('click', () => {
      this.props.action();
      elems[0].childNodes[0].childNodes[0].style.transform = "rotate(0deg)";
    });

    const saveCloudFab = document.querySelector('.saveCloudFab');
    saveCloudFab.addEventListener('click', () => {
      this.props.cloud();
      elems[0].childNodes[0].childNodes[0].style.transform = "rotate(0deg)";
    });

    const shareBtnFab = document.querySelector('.shareBtnFab');
    shareBtnFab.addEventListener('click', () => {
      this.props.share();
      elems[0].childNodes[0].childNodes[0].style.transform = "rotate(0deg)";
    });

    elems[0].addEventListener("click", e => {
      if (!instance[0].isOpen) e.target.style.transform = "rotate(0deg)";
      else e.target.style.transform = "rotate(225deg)";
    })
  }
  render() {
    return (
      <div>
        <div className="fixed-action-btn action click-to-toggle">
          <span className="btn-floating btn-large">
            <i className="large material-icons">add</i>
          </span>
          <ul>
            <li className="saveCloudFab"><span className="btn-floating blue darken-2"><i className="material-icons">save</i></span></li>
            <li className="shareBtnFab"><span className="btn-floating blue darken-2"><i className="material-icons">share</i></span></li>
            <li className="searchBtnFab"><span className="btn-floating blue darken-2"><i className="material-icons">today</i></span></li>
          </ul>
        </div>
        <div className='rights'><p>FIUSAC.app® 2019<br />todos los derechos reservados.</p></div>
      </div>
    )
  }
}

export default Floating;