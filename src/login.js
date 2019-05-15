import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.saveInput = this.saveInput.bind(this);
        this.login = this.login.bind(this);
    }
    saveInput(e) {
        // console.log("what's goin on here?: ", e.target.value);
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
        // console.log("show me this.state: ", this.state);
        return (
            <div id="form">
                {this.state.err && (
                    <div className="error">
                        Please enter a valid email and password
                    </div>
                )}
                <h1 className="welcome">TogetherApart</h1>
                <p className="login_body">
                    Please login with the email address and password you used to
                    register.
                </p>
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

                <button id="logIn" onClick={e => this.login(e)}>
                    Login
                </button>
                <p className="login_body">
                    Don't have an account yet? <Link to="/">Register </Link>
                    here.
                </p>
            </div>
        );
    }
}
