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
// import OtherProfile from "./otherprofile";
// import Friends from "./friends";
// import OnlineUsers from "./onlineUsers";
// import Chat from "./chat";
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
                    <Mirror />
                    <ProfilePic
                        firstName={first_name}
                        lastName={last_name}
                        image={image}
                        clickHandler={() => {
                            this.setState({ isUploaderVisible: true });
                        }}
                    />

                    <a href="/logout">
                        <button className="logoutButton" type="button">
                            Logout
                        </button>
                    </a>
                    <Link to="/home">Home</Link>
                    {
                        // <Link to="/friends">Friends</Link>
                        // <Link to="/onlineUsers">OnlineUsers</Link>
                    }
                    <div>
                        {this.state.code && (
                            <div className="code">{this.state.code}</div>
                        )}
                        {!this.state.code && (
                            <button
                                className="invitationButton"
                                onClick={e => this.generateInvitation(e)}
                            >
                                Generate Invitation
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
                        {
                            // <Route exact path="/"
                            // render={() => {
                            //     return(
                            //         <Clock/>
                            //     )
                            // }}>
                        }
                        {
                            // <Route
                            //     path="/user/:id"
                            //     render={props => {
                            //         return (
                            //             <OtherProfile
                            //                 key={props.match.url}
                            //                 match={props.match}
                            //                 history={props.history}
                            //                 firstName={first_name}
                            //                 lastName={last_name}
                            //                 image={image}
                            //                 bio={bio}
                            //                 user={this.user}
                            //             />
                            //         );
                            //     }}
                            // />
                            // <Route path="/friends" component={Friends} />
                            // <Route path="/onlineUsers" component={OnlineUsers} />
                        }
                        {
                            // <Route path="/user/chat" component={Chat} />
                        }
                    </div>
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
            </BrowserRouter>
        );
    }
}
