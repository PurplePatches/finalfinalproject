import * as io from "socket.io-client";
import { onlineUsers } from "./actions";
// , userJoined, userLeft

export let socket;

export function init(store) {
    if (!socket) {
        socket = io.connect();

        socket.on("onlineUsers", data => {
            console.log("gimme something!", data);
            store.dispatch(onlineUsers(data));
        });

        socket.on("userJoined", user => {
            console.log("user for userJoined: ", user);
        });

        socket.on("userLeft", userId => {
            console.log("userId for userLeft: ", userId);
        });
    }
}
