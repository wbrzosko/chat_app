import React from 'react';
import ReactDOM from 'react-dom';
import 'normalize.css';
import "./css/app.scss";


// Messages component which maps all messages delivered by the props
const ChatMessages = ({messages}) => 
(
    <div className="messages">
        <ul>
            <li>You joined the chat.</li>
            {messages.map((m,index) =>  <li key={index}>{m.username ? (<strong>+m.username+</strong>) + ': ' : '' }<i>{m.message}</i></li>)}
        </ul>
    </div> 
);

class App extends React.Component {
    constructor(props)
    {
        super(props);
        const user = 'user' + (Math.random().toString().slice(2,7)); // adds 5 random number to user
        this.state = {
            username: user,
            value: '',
            messages: []
        }
    }
    
    // Function which adds a message to the state's messges object
    getMessages() {
        socket.on('message', (data) => {
             this.setState( 
                {messages: [...this.state.messages, data]} 
             );
        })
    }

    // Function which sends a message with client's username
    login() {
        socket.emit('login', this.state.username); 
    }

    componentDidMount() {
        this.getMessages();
        this.login();
    }

    submitMessage(e) {
        e.preventDefault(); 
        if (this.state.value){
            socket.emit('message', {message: `${this.state.value}`, username: this.state.username});  
            this.setState(
                {messages: [...this.state.messages, {message: `${this.state.value}`, username: this.state.username}], value: ''}
            )
        }
    }

    handleChange(e) {
        this.setState({
            value: e.target.value
        })
    }
    
    render() {
        return(
            <div className="chat">
                <h1>Chat</h1>
                <ChatMessages messages={this.state.messages}/>
                <form className="messageForm" onSubmit={e => this.submitMessage(e)}>
                    <input className="messageInput" name="input" value={this.state.value} type="text" placeholder="Type..." onChange={e=>this.handleChange(e)} />
                    <input type="submit" value="Send" />
                </form>
            </div>
        )
    }
}

ReactDOM.render(<App />, document.getElementById('root'));