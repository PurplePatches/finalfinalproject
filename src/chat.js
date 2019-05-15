import React from "react";
import { initSocket } from "./socket";
import { connect } from "react-redux";
// import * as io from "socket.io-client";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidUpdate() {
        this.myDiv.scrollTop = "100px";
        // let socket = initSocket();
        // socket.emit("getChatMessages");
    }

    handleInput(e) {
        let socket = initSocket();
        if (e.which == 13) {
            var newChat = e.target.value;
            console.log("handleInput", e.target.value);
            socket.emit("chatMessages", newChat);
            e.target.value = "";
            e.preventDefault();
        }
    }

    render() {
        console.log("this.props: ", this.props);
        const { chatMessages } = this.props;
        return (
            <div className="myChatDiv">
                <h1>CHAT!!!</h1>
                {chatMessages != undefined &&
                    chatMessages.map(message => {
                        return <h2>Messages are here</h2>;
                    })}
                <textarea className="chatArea" onKeyDown={this.handleInput} />
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("state:", state);
    //state  refers to global REDUX state
    return {
        chatMessages: state.allMessages
    };
};

export default connect(mapStateToProps)(Chat);
