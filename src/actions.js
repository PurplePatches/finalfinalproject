import axios from "./axios";
import * as io from "socket.io-client";

const socket = io.connect();
//
// export async function receiveUsers() {
//     // console.log("made it to action/receiveUsers");
//     const { data } = await axios.get("/showFriends");
//     console.log("this is my data in action", data);
//     return {
//         type: "RECEIVE_USERS",
//         users: data
//     };
// }
//
// export async function acceptFriend(id) {
//     // console.log("made it to action/acceptFriendRequest");
//     await axios.post("/friends/accept/" + id);
//     return {
//         type: "ACCEPT_FRIEND",
//         id
//     };
// }
//
// export async function rejectFriend(id) {
//     // console.log("made it to action/rejectFriendRequest");
//     await axios.post("/friends/reject/" + id);
//     return {
//         type: "REJECT_FRIEND",
//         id
//     };
// }
//
// export async function onlineUsers(onlineUsers) {
//     console.log("made it to actions/onlineUsers");
//     return {
//         type: "ALL_USERS",
//         users: onlineUsers
//     };
// }
