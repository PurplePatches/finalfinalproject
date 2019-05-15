import React from "react";
import axios from "./axios";
import Navbar from "./navbar";
import Mirror from "./mirror";
// import Chat from "./chat";

export default class Home extends React.Component {
    constructor(props) {
        console.log("props in home");
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/home");
    }

    render() {
        console.log("render in Home", this.state);
        return (
            <div>
                {
                    // <div>
                    //     <h2>Hello {this.first_name}</h2>
                    //     <div className="chat">
                    //         <Chat />
                    //     </div>
                    // </div>
                }
                {
                    // <Navbar />
                    // <Mirror />
                    // {
                    //     // <iframe
                    //     //     width="560"
                    //     //     height="315"
                    //     //     src="https://www.youtube.com/embed/videoseries?list=PLx0sYbCqOb8TBPRdmBHs5Iftvv9TPboYG"
                    //     //     frameborder="0"
                    //     //     allow="autoplay; encrypted-media"
                    //     //     allowfullscreen
                    //     // />
                    // }
                }
            </div>
        );
    }
}
