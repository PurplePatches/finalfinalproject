import React from "react";

export default class Clock extends React.Component {
    constructor(props) {
        super(props);
        this.state = { date: new Date() };
    }

    componentDidMount() {
        this.timerID = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {
        this.setState({
            date: new Date()
        });
    }

    render() {
        // console.log("this should be the clock");
        return (
            <div>
                <h2 className="clockText">
                    It is {this.state.date.toLocaleTimeString()} in Berlin
                </h2>
            </div>
        );
    }
}

// source: https://reactjs.org/docs/state-and-lifecycle.html
