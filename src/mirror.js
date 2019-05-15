import React from "react";
import axios from "./axios";

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.canvasRef = React.createRef();
        this.saveDrawing = this.saveDrawing.bind(this);
        this.dataURL = "";
    }
    //axios.get from db to see if there's an image, if yet, show it with clear button, if no show blanks canvas
    componentDidMount() {
        axios
            .get("/mirror", {
                drawing: this.dataURL
            })
            .then(({ dataUrl }) => {
                console.log("data for drawing: ", dataURL);
                this.props.dataURL;
            });

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

        function draw(x, y) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            // ctx.strokeStyle = "#d9b310";
            ctx.lineWidth = "5";
            ctx.stroke();
            // ctx.closePath();
            lastX = x;
            lastY = y;
        }

        $("canvas").on("mousedown", function(e) {
            // console.log("click");
            isDrawing = true;
            old = { lastX: e.offsetX, lastY: e.clientY - elementOffset };
        });

        $("canvas").on("mousemove", function(e) {
            // console.log("mousemove");
            if (isDrawing) {
                var x = e.offsetX;
                var y = e.clientY - elementOffset;
                ctx.globalCompositeOperation = "destination-out";
                old = { x: x, y: y };
                draw(x, y);
            }
        });

        $("canvas").on("mouseup", () => {
            // console.log("mouseup");
            isDrawing = false;
            this.dataURL = document.getElementById("canvas").toDataURL();
            // console.log("dataURL", this.dataURL);
            this.setState({ drawing: this.dataURL });
            $("#sig").val(this.dataURL);
        });
    }

    saveDrawing(e) {
        e.preventDefault();
        // console.log("state drawing", this.state.drawing);
        axios
            .post("/mirror", {
                drawing: this.dataURL
            })
            .then(({ dataURL }) => {
                // console.log("dataURL2", dataURL);
            })
            .catch(err => {
                console.log("Something went wrong with drawing", err);
            });
    }

    render() {
        console.log("this.canvasRef: ", this.canvasRef);
        return (
            <div>
                <div id="box">
                    <canvas
                        id="canvas"
                        className="mirrorContainer"
                        width="300"
                        height="300"
                        ref={this.canvasRef}
                    />
                </div>
                <button
                    className="saveDrawing"
                    onClick={e => this.saveDrawing(e)}
                >
                    Save
                </button>
            </div>
        );
    }
}

//source: https://codepen.io/progrape/pen/XXBwWe?editors=1010
//source: https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
//https://dzone.com/articles/techniques-for-animating-on-the-canvas-in-react
