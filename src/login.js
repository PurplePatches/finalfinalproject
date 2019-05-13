import React from "react";
import axios from "./axios";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveInput = this.saveInput.bind(this);
        this.login = this.login.bind(this);
    }
    saveInput(e) {
        console.log("what's goin on here?: ", e.target.value);
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    login(e) {
        e.preventDefault();
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({ err: true });
                }
            })
            .catch(err => {
                console.log("err: ", err);
            });
    }

    render() {
        console.log("show me this.state: ", this.state);
        return (
            <div id="form">
                {this.state.err && (
                    <div className="error">
                        Please enter a valid email and password
                    </div>
                )}
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

                <button id="logIn" onClick={e => this.login(e)}>
                    Login
                </button>
            </div>
        );
    }
}
