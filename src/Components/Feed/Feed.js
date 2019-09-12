import React from 'react';
import ShowMsg from '../Alert/Alert';
import './Feed.css';

const Alert = new ShowMsg();

class Feed extends React.Component {
    constructor(props) {
        super(props);
        this.shareBtn = React.createRef();
        this.preview = React.createRef();
        this.cardImage = React.createRef();
    }

    componentDidMount() {
        const cardImage = this.cardImage.current;
        const shadow = this.preview.current;
        cardImage.addEventListener("click", () => {
            shadow.style.display = "block";
            setTimeout(() => {
                shadow.style.opacity = 1;
            }, 10);
        })
        shadow.addEventListener("click", () => {
            shadow.style.opacity = 0;
            setTimeout(() => {
                shadow.style.display = "none";
            }, 300)
        })
        //Share feed
        this.shareBtn.current.addEventListener('click', () => {
            if (navigator.share) {
                navigator.share({
                    title: "Noticia del portal",
                    text: this.props.title.toLowerCase(),
                    url: `https://portal.ingenieria.usac.edu.gt/index.php/${this.props.href}`
                })
                    .then(() => console.log('Successfully share'))
                    .catch((error) => console.log('Error sharing', error));
            } else {
                let inputCp = document.createElement("input");
                inputCp.value = `https://portal.ingenieria.usac.edu.gt/index.php/${this.props.href}`
                document.body.appendChild(inputCp);
                inputCp.select();
                document.execCommand("copy");

                Alert.showMsg({
                    title: "Link copiado",
                    body: "Revisa tu portapapeles para ver la url de la noticia en el portal de ingenieria.",
                    type: "alert"
                })

                document.body.removeChild(inputCp);
                inputCp = undefined;
            }
        })
    }

    render() {
        const fullImage = this.props.preSrc.substr(this.props.preSrc.indexOf("-") + 1);
        return (
            <div className="row">
                <div className="col s12 m7">
                    <div className="card">
                        <div className="card-image" ref={this.cardImage}>
                            <img src={`https://portal.ingenieria.usac.edu.gt/cache/mod_bt_contentslider/${this.props.preSrc}`} alt={this.props.title} />
                        </div>
                        <div className="card-content">
                            <span className="btn-floating waves-effect waves-dark white" ref={this.shareBtn}>
                                <i className="material-icons">share</i>
                            </span>
                            <span className="card-title">{this.props.title.toLowerCase()}</span>
                            <p className="card-text">
                                {this.props.text.toLowerCase()}<br className={this.props.link ? 'show' : 'hide'} /><br className={this.props.link ? 'show' : 'hide'} />
                                <a className={this.props.link ? 'show' : 'hide'} href={this.props.link ? this.props.link : "#none"}>{this.props.link}</a>
                            </p>
                        </div>
                        <div className="card-action">
                            <a href={`https://portal.ingenieria.usac.edu.gt/index.php/${this.props.href}`} className="waves-effect">
                                <i className="material-icons">collections</i> VER NOTICIA
                            </a>
                            <a download className="waves-effect" href={`https://portal.ingenieria.usac.edu.gt/images/${this.props.preSrc.substr(this.props.preSrc.indexOf("-") + 1)}`}>
                                <i className="material-icons">arrow_downward</i> DESCARGAR
                            </a>
                        </div >
                    </div >
                </div >
                <div id="imageShadow" ref={this.preview}>
                    <div id="preloader">
                        <div className="preloader-wrapper small active">
                            <div className="spinner-layer">
                                <div className="circle-clipper left">
                                    <div className="circle"></div>
                                </div><div className="gap-patch">
                                    <div className="circle"></div>
                                </div><div className="circle-clipper right">
                                    <div className="circle"></div>
                                </div>
                            </div>
                        </div>
                    <span id="loadText">Cargando imagen ...</span>
                </div>
                <div id="imageContainer">
                    <img src={`https://portal.ingenieria.usac.edu.gt/images/${fullImage}`} alt={this.props.title} />
                </div>
                <i className="material-icons">close</i>
            </div>
            </div >
        )
    }
}

export default Feed;
