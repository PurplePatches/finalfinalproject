import React from "react";

export default class Canvas extends React.Component {
    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const ctx = canvas.getContext("2d");
        var elementOffset = canvas.offsetTop;
        var left = canvas.offsetLeft;
        var lastX;
        var lastY;
        var isDrawing;

        function draw(x, y) {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
            ctx.lineTo(x, y);
            ctx.strokeStyle = "#d9b310";
            ctx.lineWidth = "5";
            ctx.stroke();
            ctx.closePath();
            lastX = x;
            lastY = y;
        }

        $("canvas").on("mousedown", function(e) {
            console.log("click");
            isDrawing = true;
            lastX = e.offsetX;
            lastY = e.clientY - elementOffset;
        });

        $("canvas").on("mousemove", function(e) {
            console.log("mousemove");
            if (isDrawing) {
                var x = e.offsetX;
                var y = e.clientY - elementOffset;
                draw(x, y);
            }
        });

        $("canvas").on("mouseup", function() {
            console.log("mouseup");
            isDrawing = false;
            var dataURL = document.getElementById("canvas").toDataURL();
            $("#sig").val(dataURL);
        });
    }

    render() {
        console.log("this.canvasRef: ", this.canvasRef);
        return (
            <canvas
                id="canvas"
                className="mirrorContainer"
                width="300"
                height="300"
                ref={this.canvasRef}
            />
        );
    }
}

//source: https://blog.cloudboost.io/using-html5-canvas-with-react-ff7d93f5dc76
//https://dzone.com/articles/techniques-for-animating-on-the-canvas-in-react
