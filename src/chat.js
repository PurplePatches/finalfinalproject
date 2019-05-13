// import React from "react";
// import { socket } from "./socket";
// import { connect } from "react-redux";
// import chatMessages from "./actions";
// // import { Link } from "react-router-dom";
//
// class Chat extends React.Component {
//     constructor(props) {
//         super(props);
//         this.handleInput = this.handleInput.bind(this);
//     }
//
//     handleInput(e) {
//         if (e.which == 13) {
//             var newChat = e.target.value;
//             console.log("handleInput", e.target.value);
//             socket.emit("chatMessages", newChat);
//         }
//     }
//
//     componentDidUpdate() {
//         this.myDiv.scrollTop = "100px";
//     }
//
//     render() {
//         return (
//             <div>
//                 <h1>CHAT!!!</h1>
//                 <textarea onKeyDown={this.handleInput} />
//                 <div className="myChatDiv" />
//             </div>
//         );
//     }
// }
//
// const mapStateToProps = state => {
//     //state  refers to global REDUX state
//     return {
//         state
//         // chatMessages: state.displayMessages.mmmmm
//     };
// };
//
// export default connect(mapStateToProps)(Chat);
