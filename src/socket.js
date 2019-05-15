import * as io from "socket.io-client";
import { onlineUsers, newMessage, getAllChatMessages } from "./actions";
// , userJoined, userLeft

let socket;
export function initSocket(store) {
    if (!socket) {
        socket = io.connect();

        console.log("made it to socket");

        socket.on("onlineUsers", data => {
            console.log("gimme something!", data);
            store.dispatch(onlineUsers(data));
        });

        socket.on("chatMessages", message => {
            console.log("chatmessages", message);
            store.dispatch(newMessage(message));
        });

        socket.on("getChatMessages", allMessages => {
            console.log("getChatMessages", allMessages);
            store.dispatch(getAllChatMessages(allMessages));
        });

        // socket.on("userJoined", user => {
        //     console.log("user for userJoined: ", user);
        // });
        //
        // socket.on("userLeft", userId => {
        //     console.log("userId for userLeft: ", userId);
        // });
    }
    return socket;
}
