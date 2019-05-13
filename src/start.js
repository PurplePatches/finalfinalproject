import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome.js";
import App from "./app.js";
import Clock from "./clock";
// import { Provider } from "react-redux";
// import { composeWithDevTools } from "redux-devtools-extension";
import { createStore, applyMiddleware } from "redux";
// import reduxPromise from "redux-promise";
// import reducer from "./reducers";
// import { init } from "./socket";

// const store = createStore(
//     reducer,
//     composeWithDevTools(applyMiddleware(reduxPromise))
// );

let element;

if (location.pathname == "/welcome") {
    element = <Welcome />;
} else {
    element = <App />;
}

ReactDOM.render(element, document.querySelector("main"));
