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
                <h1>Welcome to Together Apart</h1>
                <h2>Stay in touch with your love</h2>
                <p className="pleaseRegister">Register to enter our site</p>
                <input
                    className="first_name"
                    type="text"
                    name="first_name"
                    placeholder="First Name"
                    autoComplete="off"
                    onChange={this.saveInput}
                />

                <input
                    id="last_name"
                    type="text"
                    name="last_name"
                    placeholder="Last Name"
                    autoComplete="off"
                    onChange={this.saveInput}
                />
                <input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    autoComplete="off"
                    onChange={this.saveInput}
                />

                <input
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    autoComplete="off"
                    onChange={this.saveInput}
                />

                <input
                    id="code"
                    type="text"
                    name="code"
                    placeholder="Invitation Code"
                    autoComplete="off"
                    onChange={this.saveInput}
                />
                <input type="hidden" name="_csrf" value="{{csrfToken}}" />
                <button id="signUp" onClick={e => this.saveData(e)}>
                    Sign up
                </button>
                <h2 className="loginText">
                    Or <Link to="/login">login</Link> if you already have an
                    account
                </h2>
            </div>
        );
    }
}
