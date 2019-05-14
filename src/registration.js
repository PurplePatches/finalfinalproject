import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveInput = this.saveInput.bind(this);
        this.saveData = this.saveData.bind(this);
    }
    saveInput(e) {
        // console.log(e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    saveData(e) {
        e.preventDefault();
        axios
            .post("/registration", {
                first_name: this.state.first_name,
                last_name: this.state.last_name,
                email: this.state.email,
                password: this.state.password,
                code: this.state.code
            })
            .then(({ data }) => {
                location.replace("/");
            })
            .catch(err => {
                console.log("Oops!", err);
            });
    }

    render() {
        // console.log("show me this.state: ", this.state);
        return (
            <div id="form">
                <h1 className="welcome">TogetherApart</h1>
                <p className="reg_body">
                    Being apart is hard enough. With TogetherApart, you and your
                    love can stay in touch with real-time chats, or why not
                    leave them a bathroom mirror note for when they wake up?{" "}
                </p>
                <h2>Register to enter our site</h2>
                <div className="reg_inputs">
                    <input
                        className="form_text"
                        type="text"
                        name="first_name"
                        placeholder="First Name"
                        autoComplete="off"
                        onChange={this.saveInput}
                    />

                    <input
                        className="form_text"
                        type="text"
                        name="last_name"
                        placeholder="Last Name"
                        autoComplete="off"
                        onChange={this.saveInput}
                    />
                    <input
                        className="form_text"
                        type="email"
                        name="email"
                        placeholder="Email"
                        autoComplete="off"
                        onChange={this.saveInput}
                    />

                    <input
                        className="form_text"
                        type="password"
                        name="password"
                        placeholder="Password"
                        autoComplete="off"
                        onChange={this.saveInput}
                    />

                    <input
                        className="form_text"
                        id="invitation_code"
                        type="text"
                        name="code"
                        placeholder="Invitation Code"
                        autoComplete="off"
                        onChange={this.saveInput}
                    />
                </div>
                <input type="hidden" name="_csrf" value="{{csrfToken}}" />
                <button id="signUp" onClick={e => this.saveData(e)}>
                    Sign up
                </button>
                <p className="reg_body">
                    Already registered? <Link to="/login">Log in</Link>
                </p>
            </div>
        );
    }
}
