
import Peer = require('peerjs');
import * as React from 'react';
import {initLeap} from './initLeap';


type KVPData = {
    [key: string] : number
}

export interface PeerClientState {
    id: string,
    content: JSX.Element 
}


export default class PeerClient extends React.Component <any, PeerClientState>{

    protected peer;
    public id: string = null;
    public connections = {};
    public recent_id:string = null;
    //public sender_message = null;
    //public recent_message = null;
    public newPeerInput: string = null;
    //public peerReady: (peerId: string) => void = null;
    //public sendFunction = initLeap 

    constructor(props) {
        super(props);
        this.state = {
            id: null,
            content: null
        }

        this.peer =  new Peer({debug: 3, host: 'localhost', port:4000, path: '/myapp'}),
        this.peer.on('open', (id) => {
            this.setState({
                id: id
            }, () => {
                console.log("peer is now", this.peer, "with id = ", this.state.id)
            })
            //this.peerReady(id);
            this.sendToRemote = this.sendToRemote.bind(this);
            initLeap(this.sendToRemote);
        });
        this.peer.on('error', (err) => {
            if (err.type == 'peer-unavailable') {
                alert('the peer ' + this.recent_id + ' does not exist');
                this.removeConnection(this.recent_id);
            }
        });


        this.peer.on('connection', (dataConnection) => {
            console.log('data connection was made');
            console.log(dataConnection.id);

            this.connections[dataConnection.id] = {
                role: 'sender',
                connection: dataConnection,
            }
            console.log(this.connections);
            //this.setRecentConnection(dataConnection.id)
        });


   }

    /*
    setRecentConnection = (connection_id) => {
        this.recent_id = connection_id;
    }

    setSenderMessage = (e) => {
        this.sender_message = e.target.value

    }
    */

    updateContent = (message: KVPData): JSX.Element => {
        let content = [];
        for (let key in message) {
            content.push( key + ': ' + message[key].toString())
        }

        return (
            <div>
                {content.map( (data) => {
                    return <div> {data} </div>
                })
                }
            </div>
        )
    }
    
    sendToRemote = (message: KVPData) => {
        //console.log("connections list is", this.connections);
        this.setState({
            content: this.updateContent(message)
        })
        for (const id in this.connections) {
            if (this.connections[id].role == 'sender') {
                //console.log("sending", message, "to", this.connections[id].connection.peer)
                //console.log("send is", this.connections[id].connection.send);
                this.connections[id].connection.send(message)
            }
        }
    }
    
    removeConnection = (connection_id) => {
        console.log('closed connection to: ' + connection_id);
        delete this.connections[connection_id];
        console.log('connections are: ')
        console.log(this.connections);
        //this.updateConnections();
    }

    connectionExists = (id) => {
        if (id in this.connections) {
            alert('already connected to ' + id)
            return true;
        }
        return false;
    }
    
    render() {
        return (
            <div>
                <div>
                    App has Peer Id: {this.state.id}
                </div>
                <div>
                    Hand Content
                    {this.state.content}
                </div>
            </div>
        )
    }
    
    
    
}