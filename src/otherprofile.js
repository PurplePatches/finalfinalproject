import React from "react";
import axios from "./axios";
import Clock from "./clock";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        console.log("Am i reaching here?");
        axios
            .get("/api/user/" + id)
            .then(({ data }) => {
                console.log("whose data am i am seeing here?", data);
                this.setState(data[0]);
            })
            .catch(err => {
                console.log("error", err);
            });
    }

    render() {
        const { first_name, last_name, image, bio } = this.state;
        return (
            <div className="showOtherProfile">
                <img className="friendImage" src={image || "/default.png"} />
                <p className="otherBio">
                    {first_name} is feeling {bio}...
                </p>
                <Clock />
            </div>
        );
    }
}
