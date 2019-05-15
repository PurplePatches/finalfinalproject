export default function(state = {}, action) {
    if (action.type == "NEW_MESSAGES") {
        state = {
            ...state,
            chatMessages: action.messages
        };
    }

    if (action.type == "ALL_MESSAGES") {
        state = {
            ...state,
            allMessages: action.allMessages
        };
    }

    // if (action.type == "RECEIVE_USERS") {
    //     state = {
    //         ...state,
    //         users: action.users
    //     };
    // }
    // if (action.type == "ACCEPT_FRIEND" || action.type == "REJECT_FRIEND") {
    //     state = {
    //         ...state,
    //         users: state.users.map(user => {
    //             if (user.id != action.id) {
    //                 return user;
    //             }
    //             return {
    //                 ...user,
    //                 reject: action.type == "REJECT_FRIEND"
    //             };
    //         })
    //     };
    // }
    // if (action.type == "ALL_USERS") {
    //     state = { ...state, onlineUsers: action.users };
    // }
    return state;
}
