import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioeditor";
import Clock from "./clock";

export default function Profile(props) {
    console.log("props in profile", props);
    return (
        <div>
            <div id="profileImage">
                <ProfilePic
                    image={props.image}
                    firstName={props.firstName}
                    lastName={props.lastName}
                />
            </div>

            <div id="bioEditor">
                {<BioEditor bio={props.bio} updateBio={props.updateBio} />}
            </div>
        </div>
    );
}
