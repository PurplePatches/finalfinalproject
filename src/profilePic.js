import React from "react";

export default function ProfilePic(props) {
    console.log("props:", props);
    return (
        <img
            className="profilePic"
            onClick={props.clickHandler}
            src={props.image || "/default.png"}
            alt={props.firstName + props.lastName || "default"}
        />
    );
}
