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
import OtherProfile from "./otherprofile";
import Gallery from "./gallery";

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
                    <div className="header">
                        <div className="ownProfile">
                            <ProfilePic
                                className="profilePicHome"
                                firstName={first_name}
                                lastName={last_name}
                                image={image}
                                clickHandler={() => {
                                    this.setState({ isUploaderVisible: true });
                                }}
                                bio={bio}
                            />
                            <p className="changeImage">Click image to change</p>
                        </div>
                        <Logo />
                        <div>
                            <Route
                                path="/user/:id"
                                render={props => {
                                    return (
                                        <OtherProfile
                                            key={props.match.url}
                                            match={props.match}
                                            history={props.history}
                                            firstName={first_name}
                                            lastName={last_name}
                                            image={image}
                                            bio={bio}
                                            user={this.user}
                                        />
                                    );
                                }}
                            />
                        </div>
                    </div>
                    <Clock />
                    <div id="navContainer">
                        <div className="navbar">
                            <Link to="/">Profile |</Link>
                            <Link to="user/9"> See partner |</Link>
                            {
                                // <Link to="/gallery"> Gallery |</Link>
                            }
                            <Link to="/mirror"> Mirror |</Link>
                            <Link to="/chat"> Chat |</Link>
                            <a href="/logout">
                                <button className="logoutButton" type="button">
                                    Logout
                                </button>
                            </a>
                        </div>
                    </div>
                    <div>
                        <div id="invitation_code">
                            {this.state.code && (
                                <div className="code">
                                    Your Couple Code is: {this.state.code}
                                </div>
                            )}
                            {!this.state.code && (
                                <button
                                    className="invitationButton"
                                    onClick={e => this.generateInvitation(e)}
                                >
                                    Click here to generate Couple Code
                                </button>
                            )}
                        </div>
                        <Route
                            exact
                            path="/"
                            render={() => {
                                return (
                                    <Profile
                                        className="imtheprofile"
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
                    {
                        // <Route path="/gallery" component={Gallery} />
                    }
                </div>
            </BrowserRouter>
        );
    }
}
