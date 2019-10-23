import React, { Component } from 'react';
import CourseExpanded from '../CourseExpanded/CourseExpanded';
import './Course.css';

class Course extends Component {
  constructor(props) {
    super(props);

    //Set global dates (Today as default)
    const now1 = new Date();
    const now2 = new Date();
    const time1 = this.props.timeStart.split(':');
    const time2 = this.props.timeEnd.split(':');
    now1.setHours(time1[0]); now1.setMinutes(time1[1]);
    now2.setHours(time2[0]); now2.setMinutes(time2[1]);

    //Refs for colors
    this.timeEnd = now2;
    this.timeStart = now1;
    this.titleName = React.createRef();
    this.footer = React.createRef();
    this.titleNameS = React.createRef();
    this.allC = React.createRef();
    this.dot = React.createRef();
    this.line = React.createRef();
    this.badge = React.createRef();
    this.ct = React.createRef();
    this.closeIcon = React.createRef();
    this.shadow = React.createRef();

    //Open details
    this.control = true;
    this.details = "";
  }

  componentDidMount() {
    //Global config
    const selected = this;
    let count = 0;

    //Difference between two dates (Get Minutes)
    const compare_dates = (date1, date2) => {
      if (date1 < date2) return 1
      else if (date1.getHours() === date2.getHours() && date1.getMinutes() === date2.getMinutes()) return 2
      else if (date1 > date2) return 3
      else return 4
    }

    //Set colors for refs
    function setColor(c, sc) {
      selected.footer.current.style.background = c;
      selected.titleName.current.style.color = c;
      selected.titleNameS.current.style.color = c;
      selected.dot.current.style.color = c;
      selected.dot.current.style.transform = sc;
      selected.badge.current.style.background = c;
      if (c !== "var(--disable)") {
        if (selected.details) selected.ct.current.style.zIndex = 10;
        else selected.ct.current.style.zIndex = 2;
        selected.line.current.style.background = c;
      } else selected.line.current.style.background = "transparent";
    }

    //Notification
    function showNotification(msg) {
      Notification.requestPermission(function (result) {
        if (result === 'granted') {
          navigator.serviceWorker.ready.then(function (registration) {
            registration.showNotification('Proximo curso', {
              body: msg,
              vibrate: [200, 100, 200, 100, 200, 100, 200],
              tag: 'event',
              icon: './img/icn.png'
            });
          });
        }
      });
    }

    //Evaluate time
    this.ups = setInterval(() => {
      if (this.control) {
        const now = new Date();
        const res = compare_dates(now, this.timeStart);
        const resEnd = compare_dates(now, this.timeEnd);
        //If time to end a course < now < time to start a course
        if ((res === 3 || res === 2) && resEnd === 1) {
          setColor('var(--secondary)', 'scale(1.3,1.3)');
        } else if (res === 1) {
          const hours = (this.timeStart.getTime() - now.getTime()) / (1000 * 60);
          if (hours <= 10) {
            count++;
            setColor('var(--warning)', 'scale(1.15,1.15)');
            if (count === 1) showNotification(`${this.props.name.toLowerCase()}
en ${this.props.room} del ${this.props.build}`)
          }
        } else setColor('var(--disable)', 'scale(1,1)');
      }
    }, 500);

    //Open CourseExpanded
    this.ct.current.addEventListener("click", () => {

      //Close Details
      function closeThat() {
        const detal = document.querySelector(".details");
        detal.style.opacity = 0;
        selected.details = "";
        setTimeout(() => {
          selected.setState({});  
        }, 300);
      }

      //Main Component
      this.details = <div className="details">
        <div className="shadow" onClick={closeThat}></div>
        <CourseExpanded
          name={this.props.name}
          timeStart={this.props.timeStart}
          timeEnd={this.props.timeEnd}
          room={this.props.room}
          build={this.props.build}
          section={this.props.section}
          code={this.props.code}
          prof={this.props.prof}
          days={this.props.days}
          updateCourse={() => {
            closeThat(); this.props.updateCourse();
          }}
        />
      </div>
      this.setState({});
    })
  }
  componentWillUnmount() {
    //Clear times and reset
    clearInterval(this.ups);
  }
  render() {
    //Parse content
    let parsed = false;
    let isLab = false;
    let title = this.props.name.toLowerCase().split(' ');

    //Marks and mods
    const areaTitle = title.join(' ').substr(5);
    const labTitle = title.slice(1, 4).join(' ');
    const prof = this.props.prof.toLowerCase().split(' ').slice(0, 3).join(' ');

    //Add Labels
    if (title[0] === 'area') title = areaTitle;
    else if (title.includes('laboratorio')) { title = labTitle; isLab = true }
    else title = title.slice(0, 3).join(' ');
    if (!Number.isNaN(parseInt(title.split(' ')[2]))) parsed = true;

    return (
      <div>
        {this.details}
        <div className="allThem" ref={this.ct}>
          <div className="mainLine" ref={this.line}></div>
          <span ref={this.badge} className={isLab ? 'show composed' : 'hide'}>Laboratorio<br /></span>
          <div className="content" ref={this.allC}>
            <i className="material-icons" ref={this.dot}>fiber_manual_record</i>
            <div className='row valign-wrapper cp'>
              <div id='pres'>
                <h4 ref={this.titleName}>{parsed ? title.split(' ')[0] : title}
                  <span className={parsed ? 'show' : 'hide'}><br />{title.split(' ').slice(1.3).join(' ')}</span>
                </h4>
                <h5>{this.props.timeStart} - {this.props.timeEnd}</h5>
              </div>
              <div id='room'>
                <h4 className='right-align title' ref={this.titleNameS}>Salón: <br className={this.props.room.length > 3 ? 'show' : 'hide'} />{this.props.room}</h4>
                <h5 className='right-align'>Edificio: {this.props.build}</h5>
              </div>
              <div id='footer' ref={this.footer}>
                <h5>{prof} <br className={prof.length >= 28 ? 'show' : 'hide'} /><span>en Sección {this.props.section}</span></h5>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Course