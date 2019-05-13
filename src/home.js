import React from "react";
import axios from "./axios";
// import ProfilePic from "./profilePic";
import Navbar from "./navbar";
import Mirror from "./mirror";
import Chat from "./chat";

export default class Home extends React.Component {
    constructor(props) {
        console.log("props in home");
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/home");
    }

    render() {
        console.log("render in Home", this.state);
        return (
            <div>
                <Navbar />
                <Mirror />
            </div>
        );
    }
}
