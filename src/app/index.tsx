import * as React from 'react';
import * as ReactDOM from 'react-dom';

import PeerClient from './peerClient';

class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <PeerClient/>
            </div>
        )
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('render-target')
)