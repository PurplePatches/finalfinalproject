import React from "react";
import { Link } from "react-router-dom";
import Profile from "./profile";
import Mirror from "./mirror";

export default function Navbar(props) {
    console.log("props in navbar: ", props);
    return (
        <div className="navBar">
            <Link to="/profile">Profile |</Link>
            <a href="/chat"> Chat |</a>
            <Link to="/mirror"> Mirror |</Link>
            <a href="/timeline"> Timeline |</a>
            <a href="/logout"> Logout</a>
        </div>
    );
}
