import React from 'react';
import './CustomCourses.css';
import M from 'materialize-css/dist/js/materialize.min'

class CustomCourses extends React.Component {
    constructor(props){
        super(props);
	this.customData = {};
    }
    componentDidMount() {
        const cancel = document.querySelector(".customCancel");
        const confirm = document.querySelector(".customSave");
	const allDaysCheck = document.getElementById("allDaysCheck");
	const customDays = document.getElementById("customDays");

        cancel.addEventListener("click", () => this.props.action(false));
        confirm.addEventListener("click", () => this.props.action(this.customData));

	//DaysCheckbox
	const days = [
		["lunes", "martes"],
		["miercoles", "jueves"],
		["viernes", "sabado"],
		["domingo", ""]
	     ]
	let m = customDays.childNodes.length;                 
	for(let i = 0;i < m;i++){                                 
	    for(let j= 0;j < 2;j++){                                  
	        if(i*j !== (m-1)){
		    customDays.childNodes[i].childNodes[j].childNodes[0].addEventListener('click', () =>{
		         allDaysCheck.childNodes[0].childNodes[0].checked = false;
			 this.customData[days[i][j]] = customDays.childNodes[i].childNodes[j].childNodes[0].checked;
		    })
	        }
            }                                                 
	}

	allDaysCheck.addEventListener("click", () =>{
	    for(let i = 0;i < m;i++){
		for(let j= 0;j < 2;j++){
		    if(i*j !== (m-1)) customDays.childNodes[i].childNodes[j].childNodes[0].childNodes[0].checked = true;
		}
	    }
	    allDaysCheck.childNodes[0].childNodes[0].checked = true;
	})

        //Dropdowns
        var ds = document.querySelectorAll('select');
        M.FormSelect.init(ds);

        //Datepickers
        const elems = document.querySelectorAll(".timepicker");
        M.Timepicker.init(elems, {
            onSelect: (h, m) => {
                const timepickerTick = Array.from(document.querySelectorAll(".timepicker-tick"));
                timepickerTick.map(e => {
                    e.style.color = "var(--secondary-text)";
                    if ( (m === parseInt(e.textContent)) || ( (m < parseInt(e.textContent) + 3) && (m > parseInt(e.textContent) - 3) && e.parentElement.getAttribute("class").includes("timepicker-minutes"))) e.style.color = "#fff";
                    else if (m !== parseInt(e.textContent) && e.parentElement.getAttribute("class").includes("timepicker-minutes")) e.style.color = "var(--secondary-text)";

                    if (h.toString() === e.textContent && e.parentElement.getAttribute("class").includes("timepicker-hours")) e.style.color = "#fff";
                    else if (h.toString() !== e.textContent && e.parentElement.getAttribute("class").includes("timepicker-hours")) e.style.color = "var(--secondary-text)";

                    if (e.textContent === "00" && (m > 57 && m <= 59)) e.style.color = "#fff";
                    return 0;
                })
            },
            onOpenStart: (p, s) => {
                var time = new Date();
                let nst = time.toLocaleString('en-US', { hour: 'numeric', hour12: true })
                const timepickerTick = Array.from(document.querySelectorAll(".timepicker-tick"));
                const currentTime = p.parentElement.childNodes[1];
                timepickerTick.map(e => {
                    e.style.color = "var(--secondary-text)";
                    if (currentTime.value === "" && e.parentElement.getAttribute("class").includes("timepicker-hours")) {
                        if (parseInt(nst.substr(0, 2)) === parseInt(e.textContent)) e.style.color = "#fff";
                    }
                    else if (parseInt(currentTime.value.substr(0, currentTime.value.indexOf(":"))) === parseInt(e.textContent) && e.parentElement.getAttribute("class").includes("timepicker-hours")) e.style.color = "#fff";
                    return 0;
                })
            },
            i18n: {
                cancel: "CANCELAR",
                done: "ACEPTAR"
            }
        });
    }
    render() {
        return (
            <div id="mainCustomForm">
                <span>Información básica</span>
                <p>En esta sección especifica toda la información necesaria para agregar un curso personalizado.</p>
                <div className="input-field col s12">
                    <input id="course_name" type="text" />
                    <label htmlFor="course_name">Nombre del curso</label>
                    <span className="helper-text">Obligatorio*</span>
                </div>
                <div className="input-field col s12">
                    <input id="doc_name" type="text" />
                    <label htmlFor="doc_name">Nombre del docente</label>
                    <span className="helper-text">Obligatorio*</span>
                </div>
                <div className="row codesSet">
                    <div className="input-field col s6">
                        <input id="customCode" type="number" />
                        <label htmlFor="customCode">Código del curso</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="customSection" type="text" />
                        <label htmlFor="customSection">Sección</label>
                    </div>
                </div>
                <span>Tiempo</span>
                <p>En esta sección especifica los días en que recibirás el curso y la hora (todos los campos son obligatorios).</p>
                <div id="customDays">
                    <div className="row">
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Lunes</span>
                            </label>
                        </div>
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Martes</span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Miércoles</span>
                            </label>
                        </div>
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Jueves</span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Viernes</span>
                            </label>
                        </div>
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Sábado</span>
                            </label>
                        </div>
                    </div>
                    <div className="row">
                        <div className="input-field col s6">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Domingo</span>
                            </label>
                        </div>
                        <div className="input-field col s6" id="allDaysCheck">
                            <label>
                                <input type="checkbox" className="filled-in" />
                                <span>Todos</span>
                            </label>
                        </div>
                    </div>
                </div>
                <br />
                <div className="row">
                    <div className="input-field col s6">
                        <input id="customTI" type="text" className="timepicker" readOnly />
                        <label htmlFor="customTI">Hora inicio</label>
                    </div>
                    <div className="input-field col s6">
                        <input id="customTF" type="text" className="timepicker" readOnly />
                        <label htmlFor="customTF">Hora final</label>
                    </div>
                </div>

                <span>Lugar</span>
                <p>En esta sección especifica el edificio de la facultad donde recibirás el curso (opcional).</p>
                <div className="input-field col s12">
                    <select defaultValue="0">
                        <option value="0" disabled>Seleccionar edificio</option>
                        <option value="1">Edificio CII</option>
                        <option value="2">Edificio EPS</option>
                        <option value="3">Edificio ITUG</option>
                        <option value="4">Edificio EXT</option>
                        <option value="5">Edificio S-11</option>
                        <option value="6">Edificio S-12</option>
                        <option value="7">Edificio T-1</option>
                        <option value="8">Edificio T-3</option>
                        <option value="9">Edificio T-7</option>
                        <option value="10">Edificio T-5</option>
                    </select>
                    <label>Edificios de ingeniería</label>
                </div>

                <div id="customActions" className="right">
                    <button className="waves-effect btn-flat customCancel">cancelar</button>
                    <button className="waves-effect btn-flat  white-text customSave">guardar</button>
                </div>
            </div >
        )
    }
}

export default CustomCourses;
