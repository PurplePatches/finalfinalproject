import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = { mode: "" };
        this.editBio = this.editBio.bind(this);
        this.switchMode = this.switchMode.bind(this);
        this.saveInput = this.saveInput.bind(this);
    }

    saveInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    editBio() {
        this.setState({ mode: "" });
        // console.log("I want to see this.state: ", this.state.bio);
        axios
            .post("/bio", {
                bio: this.state.bio
            })
            .then(({ data }) => {
                console.log(data);
                this.props.updateBio(this.state.bio);
            });
    }

    switchMode() {
        this.setState({ mode: "edit" });
    }
    render() {
        if (!this.state.mode) {
            return (
                <div className="bioAdd">
                    <p>What's your mood today?</p>
                    <p>{this.props.bio}</p>
                    <button onClick={this.switchMode}>Add</button>
                </div>
            );
        } else {
            return (
                <div className="bioEditor">
                    <textarea
                        defaultValue="What's your mood today?"
                        name="bio"
                        onChange={e => this.saveInput(e)}
                    />
                    <button onClick={this.editBio}>Save</button>
                </div>
            );
        }
    }
}
