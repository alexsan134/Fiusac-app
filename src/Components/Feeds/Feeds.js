import Feed from '../Feed/Feed';
import React from 'react';
import 'materialize-css/dist/css/materialize.min.css';
import './Feeds.css';
import FeedsList from './feeds.json';

class Feeds extends React.Component {
    constructor(props) {
        super(props);
        this.FeedsList = FeedsList.feeds;
    }
    render() {
        return (
            <div id="feedContainer">
                {
                    this.FeedsList.map(e => (
                        <Feed
                            title={e.title}
                            href={e.href}
                            preSrc={e.preSrc}
                            tag={e.tag}
                            text={e.text}
                            link={e.link}
                        />
                    ))
                }
            </div>
        )
    }
}

export default Feeds;