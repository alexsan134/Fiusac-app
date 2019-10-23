import Feed from '../Feed/Feed';
import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Feeds.css';
import { getFeeds } from '../../Functions';
import NotFound from '../404/404';

class Feeds extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            list: []
        }
        this.element = <div className="loadingUser">
            <h4>Espera solo un momento ...</h4>
            <p>Esto dependerá de la velocidad de tu conexión a internet, y solo ocurrirá cuando exista un cambio en la red.</p>
        </div>
    }
    componentDidMount() {
        getFeeds(data => {
            this.element = data ?
                <div id="feedList">
                    <div id="feedBanner">
                        <h4>Mantente conectado</h4>
                        <p>Ve las noticias mas recientes de la facultad y el portal de ingeniería con notificaciones gratuitas.</p>
                    </div>
                    {data.feedList.reverse().map((e, i) => (
                        <Feed
                            key={i}
                            title={e.title}
                            href={e.href}
                            preSrc={e.preSrc}
                            tag={e.tag}
                            text={e.text}
                            link={e.link}
                        />
                    ))}
                </div> :
                <NotFound body="Lo sentimos necesitas una conexión a internet para descargar las noticias del portal" />
            this.setState({});
        })
    }
    render() {
        return (
            <div id="feedContainer">
                {this.element}
            </div>
        )
    }
}

export default Feeds;