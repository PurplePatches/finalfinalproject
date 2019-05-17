import React from "react";
import axios from "./axios";
import { initSocket } from "./socket";
import { connect } from "react-redux";

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
        this.saveDrawing = this.saveDrawing.bind(this);
        this.clearDrawing = this.clearDrawing.bind(this);
        this.dataURL = "";
    }
    //axios.get from db to see if there's an image, if yes, show it with clear button, if no show blanks canvas
    componentDidMount() {
        let socket = initSocket();
        const url = "./pencil-edge-mirror1280.jpg";
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = url;
        img.onload = () => {
            var width = Math.min(500, img.width);
            var height = img.height * (width / img.width);
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
        };
        var elementOffset = canvas.offsetTop;
        var left = canvas.offsetLeft;
        var lastX;
        var lastY;
        var isDrawing;
        var old = null;
        var mouse = {
            click: false,
            move: false,
            pos: { x: 0, y: 0 },
            pos_prev: false
        };

        socket.on("draw_line", function(data) {
            var line = data.line;
            // console.log("DRAW!!!!!!!!!!!!", line);
            ctx.globalCompositeOperation = "destination-out";
            if (line[1].x === 0) {
                return;
            }
            ctx.beginPath();
            ctx.lineWidth = "5";
            ctx.moveTo(line[0].x, line[0].y);
            // console.log("lines x and y0", line[0].x, line[0].y);
            ctx.lineTo(line[1].x, line[1].y);
            ctx.stroke();
            ctx.closePath();
        });

        $("canvas").on("mousedown", function(e) {
            // console.log("click");
            isDrawing = true;
            mouse.pos_prev.x = e.offsetX;
            mouse.pos_prev.y = e.clientY - elementOffset;
            mouse.pos.x = e.offsetX;
            mouse.pos.y = e.clientY - elementOffset;
            // old = { lastX: e.offsetX, lastY: e.clientY - elementOffset };
            mouse.click = true;
        });

        $("canvas").on("mousemove", function(e) {
            // console.log("mousemove");
            if (isDrawing) {
                mouse.pos.x = e.offsetX;
                mouse.pos.y = e.clientY - elementOffset;
                ctx.globalCompositeOperation = "destination-out";
                // old = { x: x, y: y };
                mouse.move = true;
            }
        });

        $("canvas").on("mouseup", () => {
            // console.log("mouseup");
            isDrawing = false;
            var dataURL = document.getElementById("canvas").toDataURL();
            $("#sig").val(dataURL);
            this.dataURL = document.getElementById("canvas").toDataURL();
            // console.log("dataURL", this.dataURL);
            this.setState({ drawing: this.dataURL });
            // console.log("this.dataURL: ", this.dataURL);
            $("#sig").val(this.dataURL);
            // console.log("this.dataURL val: ", dataURL);
            mouse.click = false;
        });

        function mainLoop() {
            // check if the user is drawing
            if (mouse.click && mouse.move && mouse.pos_prev) {
                // console.log("mde ir here");
                // // send line to to the serve
                // console.log("mouse pos", { line: [mouse.pos, mouse.pos_prev] });
                socket.emit("draw_line", { line: [mouse.pos, mouse.pos_prev] });
                mouse.move = false;
            }
            // console.log("abput tp set mousr prev: ", mouse.pos.x, mouse.pos.y);
            mouse.pos_prev = { x: mouse.pos.x, y: mouse.pos.y };
            setTimeout(mainLoop, 25);
        }
        mainLoop();
    }

    saveDrawing(e) {
        e.preventDefault();
        // console.log("show me dataURL: ", this.dataURL);
        // console.log("state drawing", this.state.drawing);
        axios
            .post("/mirror", {
                drawing: this.dataURL
            })
            .then(({ dataURL }) => {})
            .catch(err => {
                console.log("Something went wrong with drawing", err);
            });
    }

    clearDrawing(e) {
        const url = "./pencil-edge-mirror1280.jpg";
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        var img = new Image();
        img.src = url;
        img.onload = () => {
            var width = Math.min(500, img.width);
            var height = img.height * (width / img.width);
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);
        };
    }

    render() {
        console.log("this.canvasRef: ", this.canvasRef);
        return (
            <div id="entireMirror">
                <div className="drawingDescription">
                    <h2>Use your mouse to draw something and hit 'Save' to</h2>
                    <h2>send, or draw something together</h2>
                </div>
                <div id="box">
                    <canvas
                        id="canvas"
                        className="mirrorContainer"
                        width="500"
                        height="500"
                        ref={this.canvasRef}
                    />
                </div>
                <div className="drawingButtons">
                    <button
                        className="saveDrawing"
                        onClick={e => this.saveDrawing(e)}
                    >
                        Save
                    </button>
                    <button
                        className="resetDrawing"
                        onClick={e => this.clearDrawing(e)}
                    >
                        Reset
                    </button>
                </div>
            </div>
        );
    }
}

//source: http://code-and.coffee/post/2015/collaborative-drawing-canvas-node-websocket/ (socket + canvas)
//source: https://stackoverflow.com/questions/21043161/clear-canvas-button (reset)
//source: https://codepen.io/progrape/pen/XXBwWe?editors=1010
//source: https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
//https://dzone.com/articles/techniques-for-animating-on-the-canvas-in-react
