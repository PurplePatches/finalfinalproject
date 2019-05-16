import React from "react";
import { initSocket } from "./socket";
import { connect } from "react-redux";

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
    }

    componentDidMount() {
        if (this.myChatDiv) {
            this.myChatDiv.scrollTop = this.myChatDiv.scrollTop;
        }
    }

    componentDidUpdate() {
        // this.myChatDiv.scrollTop = "100px";
        // // let socket = initSocket();
        // socket.emit("getChatMessages");
    }

    handleInput(e) {
        let socket = initSocket();
        if (e.which == 13) {
            var newChat = e.target.value;
            // console.log("handleInput", e.target.value);
            socket.emit("chatMessages", newChat);
            e.target.value = "";
            // e.preventDefault();
            this.setState({
                message: e.target.value
            });
        }
    }

    render() {
        console.log("this.props: ", this.props);
        const { chatMessages, myChatDiv } = this.props;
        return (
            <div className="myChatDiv">
                <h1>CHAT!!!</h1>
                <textarea className="chatArea" onKeyDown={this.handleInput} />
                <button className="sendMessage" onClick={this.handleInput}>
                    Send
                </button>
                {chatMessages != undefined &&
                    chatMessages.map((message, id) => {
                        // console.log("message: ", message);
                        return (
                            <div className="singleMessage" key={id}>
                                <img
                                    className="chatImage"
                                    src={message.image}
                                />
                                <div>{message.first_name} says...</div>
                                <div>{message.chat}</div>
                                <div>message sent: {message.sent}</div>
                            </div>
                        );
                    })}
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
