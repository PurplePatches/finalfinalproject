import React from "react";
import BioEditor from "./bioeditor";

export default function Profile(props) {
    console.log("props in profile", props);
    return (
        <div className="profile">
            <div id="bioEditor">
                {<BioEditor bio={props.bio} updateBio={props.updateBio} />}
            </div>
        </div>
    );
}
