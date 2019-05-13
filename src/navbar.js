import React from "react";

export default function Navbar(props) {
    console.log("props in navbar: ", props);
    return (
        <div className="navBar">
            <a href="/profile">Profile |</a>
            <a href="/chat"> Chat |</a>
            <a href="/mirror"> Mirror |</a>
            <a href="/timeline"> Timeline |</a>
            <a href="/logout"> Logout</a>
        </div>
    );
}
