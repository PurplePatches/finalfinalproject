import React from "react";
import axios from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Logo from "./logo";
import Profile from "./profile";
import ProfilePic from "./profilePic";
import Uploader from "./uploader";
import Home from "./home";
import Clock from "./clock";
import Mirror from "./mirror";
import Chat from "./chat";
import { Link } from "react-router-dom";

export default class App extends React.Component {
    constructor(props) {
        console.log("props in app: ", props);
        super(props);
        this.state = {
            isUploaderVisible: false,
            mode: "",
            code: null
        };
        this.updateBio = this.updateBio.bind(this);
        this.generateInvitation = this.generateInvitation.bind(this);
    }

    componentDidMount() {
        axios
            .get("/user")
            .then(({ data }) => {
                this.setState(data);
            })
            .catch(err => {
                alert(err);
            });
    }

    updateBio(newBio) {
        // console.log("made it to here");
        this.setState({ bio: newBio });
    }
    generateInvitation(e) {
        e.preventDefault();
        axios.post("/invitation").then(({ data }) => {
            this.setState({
                code: data.code
            });
        });
    }

    render() {
        console.log("state:", this.state);
        if (!this.state.id) {
            return (
                <div>
                    <img src="spinner.gif" />
                </div>
            );
        }
        const { first_name, last_name, image, bio } = this.state;

        return (
            <BrowserRouter>
                <div>
                    <Logo />
                    <Clock />
                    <div className="navbar">
                        <Link to="/">Profile |</Link>
                        <Link to="/home"> Home |</Link>
                        <Link to="/chat"> Chat |</Link>
                        <Link to="/mirror"> Mirror |</Link>
                        <a> Gallery | </a>
                        <a href="/logout">
                            <button className="logoutButton" type="button">
                                Logout
                            </button>
                        </a>
                    </div>
                    <ProfilePic
                        firstName={first_name}
                        lastName={last_name}
                        image={image}
                        clickHandler={() => {
                            this.setState({ isUploaderVisible: true });
                        }}
                    />
                    <div>
                        {this.state.code && (
                            <div className="code">
                                This your Couple Code: {this.state.code}
                            </div>
                        )}
                        {!this.state.code && (
                            <button
                                className="invitationButton"
                                onClick={e => this.generateInvitation(e)}
                            >
                                Generate Couple Code
                            </button>
                        )}
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        firstName={first_name}
                                        lastName={last_name}
                                        image={image}
                                        bio={bio}
                                        updateBio={this.updateBio}
                                        clickHandler={() => {
                                            this.setState({
                                                isUploaderVisible: true
                                            });
                                        }}
                                    />
                                );
                            }}
                        />
                    </div>
                    <Route
                        exact
                        path="/home"
                        render={() => {
                            console.log("Home in App");
                            return (
                                <div className="home">
                                    <Home />
                                </div>
                            );
                        }}
                    />
                    <Route path="/chat" component={Chat} />
                    <Route path="/mirror" component={Mirror} />
                    <div className="uploader1">
                        {this.state.isUploaderVisible && (
                            <Uploader
                                setUrl={image =>
                                    this.setState({
                                        image: image,
                                        isUploaderVisible: false
                                    })
                                }
                            />
                        )}
                    </div>
                </div>
            </BrowserRouter>
        );
    }
}
