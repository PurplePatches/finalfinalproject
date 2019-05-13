import React from "react";
import { HashRouter, Route } from "react-router-dom";
import Registration from "./registration";
import Logo from "./logo";
import Login from "./login";

export default function Welcome() {
    return (
        <div>
            <Logo className="logo" />
            <HashRouter>
                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                </div>
            </HashRouter>
        </div>
    );
}
